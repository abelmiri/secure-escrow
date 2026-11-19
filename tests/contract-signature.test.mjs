import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import vm from "node:vm"
import ts from "typescript"

function loadApi(fetchImpl = async () => new Response("{}")) {
  let unauthorized = 0
  const exports = {}
  const source = ts.transpileModule(
    fs.readFileSync("src/hooks/deals/contractSignatureApi.ts", "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    },
  ).outputText
  const dependencies = {
    "@/constants/urls/API_URLS": {
      default: {
        contractSignature: ({ id, operation }) =>
          `v1/deals/${id}/contract-signature${operation ? `/${operation}` : ""}`,
      },
    },
    "@/request/headerMaker": {
      default: ({ headers } = {}) => ({
        Authorization: "test-token",
        ...headers,
      }),
    },
    "@/request/urlMaker": {
      default: ({ url }) => `https://example.test/${url}`,
    },
    "@/helpers/auth/handleUnauthorized": { default: () => unauthorized++ },
  }
  vm.runInNewContext(source, {
    exports,
    require: (name) => dependencies[name],
    fetch: fetchImpl,
    Uint8Array,
    Error,
  })
  return { api: exports, unauthorized: () => unauthorized }
}

test("enrollment submits numeric Rokh location IDs and an idempotency key", async () => {
  const { api } = loadApi(async (url, options) => {
    assert.equal(
      url,
      "https://example.test/v1/deals/108/contract-signature/certificate/enroll",
    )
    assert.equal(options.method, "POST")
    assert.equal(options.headers["Idempotency-Key"], "request-key")
    assert.equal(options.headers["Content-Type"], "application/json")
    assert.deepEqual(JSON.parse(options.body), {
      province_id: 8,
      city_id: 303,
      otp: "012345",
    })
    return Response.json(
      { status: "PENDING", job_token: "job" },
      { status: 202 },
    )
  })
  const result = await api.certificateRequest(
    108,
    "enroll",
    new AbortController().signal,
    {
      key: "request-key",
      data: { province_id: 8, city_id: 303, otp: "012345" },
    },
  )
  assert.equal(result.job_token, "job")
})

test("normalizes Persian and Arabic digits without changing leading zeroes", () => {
  const { api } = loadApi()
  assert.equal(api.normalizeSignatureDigits("۰۱۲٣٤۵"), "012345")
})

test("checks PNG header, MIME and exact size boundary", async () => {
  const { api } = loadApi()
  const bytes = [137, 80, 78, 71, 13, 10, 26, 10]
  assert.equal(
    await api.validateSignature(
      new File([new Uint8Array(bytes)], "signature.png", { type: "image/png" }),
    ),
    "",
  )
  for (const file of [
    new File(["fake"], "fake.png", { type: "image/png" }),
    new File([], "empty.png", { type: "image/png" }),
    new File([new Uint8Array(bytes)], "wrong.jpg", { type: "image/jpeg" }),
    new File([new Uint8Array(1048577)], "large.png", { type: "image/png" }),
  ]) {
    assert.notEqual(await api.validateSignature(file), "")
  }
  const boundary = new Uint8Array(1048576)
  boundary.set(bytes)
  assert.equal(
    await api.validateSignature(
      new File([boundary], "max.png", { type: "image/png" }),
    ),
    "",
  )
})

test("reconciles provider UNKNOWN even when overall status remains PENDING", () => {
  const { api } = loadApi()
  assert.equal(
    api.isReconciling({ status: "PENDING", signers: [{ status: "UNKNOWN" }] }),
    true,
  )
  assert.equal(
    api.isReconciling({
      status: "PENDING",
      signers: [{ status: "SIGNED" }, { status: "PENDING" }],
    }),
    false,
  )
  for (const status of ["COMPLETED", "REFUSED", "EXPIRED"])
    assert.equal(api.isFinished({ status }), true)
})

test("uses signer statuses when the request still says PROCESSING after a failure", () => {
  const { api } = loadApi()
  const snapshot = {
    status: "PROCESSING",
    signers: [{ status: "FAILED" }, { status: "PENDING" }],
  }
  assert.equal(api.isReconciling(snapshot), false)
  snapshot.signers[0].status = "PROCESSING"
  assert.equal(api.isReconciling(snapshot), true)
})

test("shows the same PDF the backend will submit for the next signature", () => {
  const { api } = loadApi()
  const snapshot = { contract_document: "original", signed_document: null }
  assert.equal(api.getSigningDocument(snapshot).id, "original")
  assert.equal(api.getSigningDocument(snapshot).signed, false)
  snapshot.signed_document = "signed-version"
  assert.equal(api.getSigningDocument(snapshot).id, "signed-version")
  assert.equal(api.getSigningDocument(snapshot).signed, true)
  assert.equal(api.isContractPdf("Generated deal contract PDF"), true)
  assert.equal(api.isContractPdf("Digitally signed deal contract PDF"), true)
  assert.equal(api.isContractPdf(null), false)
})

test("reads Django's flattened validation errors as well as structured errors", async () => {
  const { api } = loadApi(
    async () =>
      new Response(
        '{"error":"otp.:The signer must configure a signing PIN first."}',
        {
          status: 400,
        },
      ),
  )
  await assert.rejects(
    api.signatureRequest(42, new AbortController().signal, "otp"),
    (error) => {
      const message = "The signer must configure a signing PIN first."
      assert.equal(api.signatureFieldErrors(error).otp, message)
      assert.equal(api.signatureErrorMessage(error), message)
      return true
    },
  )
  const pin = new api.SignatureError(400, {
    pin: ["Invalid PIN"],
    code: "INVALID_PIN",
  })
  assert.equal(api.signatureFieldErrors(pin).pin, "Invalid PIN")
  assert.equal(api.signatureErrorMessage(pin), "رمز شش‌رقمی امضا صحیح نیست.")
  const missingPdf = new api.SignatureError(400, {
    error: ":The contract PDF has not been generated yet.",
  })
  assert.equal(
    api.signatureErrorMessage(missingPdf),
    "The contract PDF has not been generated yet.",
  )
})

test("sends bodyless OTP and multipart sign without overriding content-type", async () => {
  const calls = []
  const { api } = loadApi(async (url, options) => {
    calls.push({ url, options })
    return new Response('{"can_sign":true}')
  })
  const signal = new AbortController().signal
  await api.signatureRequest(42, signal, "otp")
  const data = new FormData()
  data.append("signature", new File(["png"], "signature.png"))
  await api.signatureRequest(42, signal, "sign", data)
  assert.equal(calls[0].options.method, "POST")
  assert.equal(calls[0].options.body, undefined)
  assert.equal(calls[1].options.body, data)
  assert.equal(calls[1].options.headers["Content-Type"], undefined)
  assert.equal(calls[1].options.headers.Authorization, "test-token")
})

test("preserves structured errors, does not log out on 403, and never retries failed submissions", async () => {
  let calls = 0
  const { api, unauthorized } = loadApi(async () => {
    calls++
    return new Response('{"status":"UNKNOWN","otp":["expired"]}', {
      status: 403,
    })
  })
  await assert.rejects(
    api.signatureRequest(
      42,
      new AbortController().signal,
      "sign",
      new FormData(),
    ),
    (error) => error.status === 403 && error.data.status === "UNKNOWN",
  )
  assert.equal(calls, 1)
  assert.equal(unauthorized(), 0)
  const auth = loadApi(async () => new Response("{}", { status: 401 }))
  await assert.rejects(
    auth.api.signatureRequest(42, new AbortController().signal),
  )
  assert.equal(auth.unauthorized(), 1)
  let networkCalls = 0
  const network = loadApi(async () => {
    networkCalls++
    throw new TypeError("network unavailable")
  })
  await assert.rejects(
    network.api.signatureRequest(
      42,
      new AbortController().signal,
      "sign",
      new FormData(),
    ),
  )
  assert.equal(networkCalls, 1)
})
