import { useEffect, useRef, useState, type PointerEvent } from "react"
import { Box, Button, Stack, Typography } from "@mui/material"
import { validateSignature } from "@/hooks/deals/contractSignatureApi"

export default function SignatureInput({
  onChange,
  disabled,
}: {
  onChange: (file: File | null) => void
  disabled: boolean
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const hasInk = useRef(false)
  const selection = useRef(0)
  const [preview, setPreview] = useState("")
  const [error, setError] = useState("")
  useEffect(
    () => () => {
      selection.current++
    },
    [],
  )
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview)
    },
    [preview],
  )
  const clear = () => {
    selection.current++
    canvas.current?.getContext("2d")?.clearRect(0, 0, 600, 200)
    drawing.current = false
    hasInk.current = false
    setPreview("")
    setError("")
    onChange(null)
  }
  const select = async (file: File) => {
    const version = ++selection.current
    const message = await validateSignature(file)
    if (version !== selection.current) return
    setError(message)
    if (message) {
      onChange(null)
      setPreview("")
      return
    }
    onChange(file)
    setPreview(URL.createObjectURL(file))
  }
  const point = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return [
      ((event.clientX - rect.left) * 600) / rect.width,
      ((event.clientY - rect.top) * 200) / rect.height,
    ] as const
  }
  const start = (event: PointerEvent<HTMLCanvasElement>) => {
    if (disabled || !event.isPrimary) return
    const ctx = canvas.current?.getContext("2d")
    if (!ctx) return
    selection.current++
    drawing.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    const [x, y] = point(event)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.strokeStyle = "#111827"
    onChange(null)
    setPreview("")
  }
  const move = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || disabled) return
    const ctx = canvas.current?.getContext("2d")
    if (!ctx) return
    ctx.lineTo(...point(event))
    ctx.stroke()
    hasInk.current = true
  }
  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    const version = selection.current
    if (hasInk.current)
      canvas.current?.toBlob((blob) => {
        if (blob && version === selection.current)
          void select(new File([blob], "signature.png", { type: "image/png" }))
      }, "image/png")
  }
  return (
    <Stack spacing={1}>
      <Typography>
        امضا را در کادر رسم کنید یا تصویر PNG بارگذاری کنید.
      </Typography>
      <Box
        component="canvas"
        ref={canvas}
        width={600}
        height={200}
        aria-label="کادر رسم امضا"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        sx={{
          width: "100%",
          height: 160,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: "white",
          touchAction: "none",
          opacity: disabled ? 0.5 : 1,
        }}
      />
      <Stack direction="row" spacing={1}>
        <Button disabled={disabled} onClick={clear}>
          پاک‌کردن امضا
        </Button>
        <Button component="label" disabled={disabled}>
          آپلود PNG
          <input
            hidden
            type="file"
            accept="image/png"
            disabled={disabled}
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ""
              if (file) {
                clear()
                void select(file)
              }
            }}
          />
        </Button>
      </Stack>
      {preview && (
        <Box
          component="img"
          src={preview}
          alt="پیش‌نمایش امضای انتخاب‌شده"
          sx={{
            maxWidth: "100%",
            height: 70,
            objectFit: "contain",
            bgcolor: "white",
          }}
        />
      )}
      {error && (
        <Typography color="error" role="alert">
          {error}
        </Typography>
      )}
    </Stack>
  )
}
