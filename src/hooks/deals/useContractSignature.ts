import { useCallback, useEffect, useRef, useState } from "react"
import {
  isFinished,
  isReconciling,
  SignatureError,
  signatureErrorMessage,
  signatureRequest,
  type SignatureSnapshot,
} from "./contractSignatureApi"

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
  const refreshDeal = useRef(onDealRefresh)
  useEffect(() => {
    refreshDeal.current = onDealRefresh
  }, [onDealRefresh])

  const run = useCallback(
    async (
      operation?: "otp" | "sign" | "refresh" | "decline",
      body?: FormData,
    ) => {
      if (lock.current || !active.current) return
      lock.current = true
      setBusy(true)
      setError("")
      setFields({})
      const abort = new AbortController()
      controller.current = abort
      const timeout = setTimeout(() => abort.abort(), 30000)
      if (operation === "sign") {
        unresolved.add(key)
        setUncertain(true)
      }
      try {
        const result = await signatureRequest(id, abort.signal, operation, body)
        if (!active.current || controller.current !== abort) return
        inaccessible.current = false
        setSnapshot(result)
        if (operation === "refresh" || operation === "sign") {
          if (!isReconciling(result)) {
            unresolved.delete(key)
            setUncertain(false)
          }
        }
        if (isFinished(result) || !result.can_sign || result.signed_signer)
          void refreshDeal.current().catch(() => {})
        return result
      } catch (caught) {
        if (!active.current || controller.current !== abort) return
        if (caught instanceof SignatureError) {
          const pending = ["PROCESSING", "UNKNOWN"].includes(
            String(caught.data.status),
          )
          if (pending) {
            unresolved.add(key)
            setUncertain(true)
          } else if (operation === "sign" && caught.status === 400) {
            unresolved.delete(key)
            setUncertain(false)
          }
          const nextFields: Record<string, string> = {}
          for (const name of ["pin", "otp", "signature"]) {
            const value = caught.data[name]
            if (typeof value === "string") nextFields[name] = value
            else if (Array.isArray(value))
              nextFields[name] = value
                .filter((v) => typeof v === "string")
                .join("؛ ")
          }
          setFields(nextFields)
          if (caught.status === 403 || caught.status === 404) {
            inaccessible.current = true
            setSnapshot(null)
          }
          // A definitive rejection still needs a fresh permission snapshot before a new attempt.
          if (operation === "sign" && caught.status === 400 && !pending) {
            setSnapshot(null)
            try {
              const current = await signatureRequest(id, abort.signal)
              if (active.current && controller.current === abort)
                setSnapshot(current)
            } catch {
              // Keep the form closed until the next successful status check.
            }
          }
        }
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
    const check = () => {
      if (document.visibilityState !== "visible" || inaccessible.current) return
      void run(
        uncertain || (snapshot && isReconciling(snapshot))
          ? "refresh"
          : undefined,
      )
    }
    const timer = setInterval(check, 20000)
    document.addEventListener("visibilitychange", check)
    return () => {
      clearInterval(timer)
      document.removeEventListener("visibilitychange", check)
    }
  }, [run, snapshot, uncertain])

  return { snapshot, busy, uncertain, error, fields, run }
}
