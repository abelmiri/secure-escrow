import { useCallback, useEffect, useRef, useState } from "react"
import useSWR from "swr"
import {
  isFinished,
  isReconciling,
  SignatureError,
  signatureErrorMessage,
  signatureFieldErrors,
  signatureRequest,
  type SignatureSnapshot,
} from "./contractSignatureApi"

export function useContractSignatureStatus(id: number | null, identity: string) {
  return useSWR(
    id === null ? null : ["contract-signature-status", id, identity] as const,
    ([, dealId]) => signatureRequest(dealId, AbortSignal.timeout(30000)),
    { shouldRetryOnError: false },
  )
}

// No credentials are retained here. An interrupted submission must be reconciled even after reopening.
const unresolved = new Set<string>()
export function useContractSignature(
  id: number,
  identity: string,
  onDealRefresh: () => Promise<unknown>,
) {
  const key = `${identity}:${id}`
  const [snapshot, setSnapshot] = useState<SignatureSnapshot | null>(null)
  const [busy, setBusy] = useState(false)
  const [uncertain, setUncertain] = useState(unresolved.has(key))
  const [error, setError] = useState("")
  const [fields, setFields] = useState<Record<string, string>>({})
  const active = useRef(false)
  const lock = useRef(false)
  const inaccessible = useRef(false)
  const controller = useRef<AbortController | null>(null)
  const latest = useRef<SignatureSnapshot | null>(null)
  const refreshDeal = useRef(onDealRefresh)
  useEffect(() => {
    refreshDeal.current = onDealRefresh
  }, [onDealRefresh])

  const run = useCallback(
    async (
      operation?: "otp" | "sign" | "refresh" | "decline",
      body?: FormData,
      background = false,
    ) => {
      if (lock.current || !active.current) return
      lock.current = true
      setBusy(true)
      if (!background) {
        setError("")
        setFields({})
      }
      const abort = new AbortController()
      controller.current = abort
      const timeout = setTimeout(() => abort.abort(), 30000)
      if (operation === "sign") {
        unresolved.add(key)
        setUncertain(true)
      }
      const applySnapshot = (result: SignatureSnapshot, resolveSubmission: boolean) => {
        const previous = latest.current
        latest.current = result
        setSnapshot(result)
        if (resolveSubmission && !isReconciling(result)) {
          unresolved.delete(key)
          setUncertain(false)
          if (background) {
            setError("")
            setFields({})
          }
        }
        if (
          result.signed_signer ||
          (previous
            ? previous.status !== result.status ||
              previous.can_sign !== result.can_sign ||
              previous.signed_document !== result.signed_document ||
              previous.signers.some((signer, index) =>
                signer.status !== result.signers[index]?.status,
              )
            : !result.can_sign)
        ) {
          void refreshDeal.current().catch(() => {})
        }
      }
      try {
        const result = await signatureRequest(id, abort.signal, operation, body)
        if (!active.current || controller.current !== abort) return
        inaccessible.current = false
        applySnapshot(result, operation === "refresh" || operation === "sign")
        return result
      } catch (caught) {
        if (!active.current || controller.current !== abort) return
        const accessLost =
          caught instanceof SignatureError &&
          (caught.status === 403 || caught.status === 404)
        if (background && !accessLost) return
        if (caught instanceof SignatureError) {
          const pending = ["PROCESSING", "UNKNOWN"].includes(
            String(caught.data.status),
          )
          if (pending) {
            unresolved.add(key)
            setUncertain(true)
          }
          setFields(signatureFieldErrors(caught))
          if (accessLost) {
            inaccessible.current = true
            setSnapshot(null)
          }
          // A definitive rejection still needs a fresh permission snapshot before a new attempt.
          if (operation === "sign" && caught.status === 400) {
            try {
              const current = await signatureRequest(id, abort.signal)
              if (active.current && controller.current === abort)
                applySnapshot(current, !pending)
            } catch {
              // Keep submission blocked until the next successful status check.
            }
          }
        }
        if (!active.current || controller.current !== abort) return
        setError(signatureErrorMessage(caught))
        void refreshDeal.current().catch(() => {})
      } finally {
        clearTimeout(timeout)
        if (controller.current === abort) {
          lock.current = false
          if (active.current) setBusy(false)
        }
      }
    },
    [id, key],
  )

  useEffect(() => {
    active.current = true
    void run(unresolved.has(key) ? "refresh" : undefined)
    return () => {
      active.current = false
      controller.current?.abort()
      controller.current = null
      lock.current = false
    }
  }, [run, key])

  useEffect(() => {
    if (snapshot && isFinished(snapshot) && !uncertain) return
    if (!uncertain && !(snapshot && isReconciling(snapshot))) return
    const timer = setInterval(() => {
      if (document.visibilityState !== "visible" || inaccessible.current) return
      void run("refresh", undefined, true)
    }, 20000)
    return () => clearInterval(timer)
  }, [run, snapshot, uncertain])

  return { snapshot, busy, uncertain, error, fields, run }
}
