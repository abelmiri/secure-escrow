"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./styles/TransactionFormDetails.module.scss"

export interface MapLocationValue {
  lat: number
  lng: number
}

interface IranLocationPickerProps {
  title: string
  value?: MapLocationValue | null
  required?: boolean
  error?: boolean
  readOnly?: boolean
  onChange?: (value: MapLocationValue) => void
}

interface NeshanLatLng {
  lat: number
  lng: number
}

interface NeshanMapEvent {
  latlng: NeshanLatLng
}

interface NeshanMarkerEvent {
  target: {
    getLatLng: () => NeshanLatLng
  }
}

interface NeshanMarker {
  addTo: (map: NeshanMap) => NeshanMarker
  setLatLng: (latLng: [number, number] | NeshanLatLng) => NeshanMarker
  getLatLng: () => NeshanLatLng
  on: (eventName: "dragend", handler: (event: NeshanMarkerEvent) => void) => void
}

interface NeshanMap {
  on: (eventName: "click", handler: (event: NeshanMapEvent) => void) => void
  panTo: (latLng: [number, number]) => void
  setView: (latLng: [number, number], zoom?: number) => void
  remove: () => void
}

interface NeshanLeaflet {
  Map: new (
    element: HTMLElement,
    options: {
      key: string
      maptype: string
      poi: boolean
      traffic: boolean
      center: [number, number]
      zoom: number
    },
  ) => NeshanMap
  marker: (
    latLng: [number, number],
    options?: { draggable?: boolean },
  ) => NeshanMarker
}

declare global {
  interface Window {
    L?: NeshanLeaflet
  }
}

const neshanMapKey = process.env.NEXT_PUBLIC_NESHAN_MAP_KEY
const neshanMapType = process.env.NEXT_PUBLIC_NESHAN_MAP_TYPE || "standard-day"
const defaultLocation: MapLocationValue = { lat: 35.6892, lng: 51.389 }
const neshanCssId = "neshan-leaflet-css"
const neshanScriptId = "neshan-leaflet-script"
let neshanLoader: Promise<NeshanLeaflet> | null = null

const roundCoordinate = (value: number) => Math.round(value * 100000) / 100000

const normalizeLocation = (location: NeshanLatLng): MapLocationValue => ({
  lat: roundCoordinate(location.lat),
  lng: roundCoordinate(location.lng),
})

const loadNeshanLeaflet = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Neshan map is available in browser only."))
  }

  if (window.L) {
    return Promise.resolve(window.L)
  }

  if (neshanLoader) return neshanLoader

  neshanLoader = new Promise<NeshanLeaflet>((resolve, reject) => {
    if (!document.getElementById(neshanCssId)) {
      const link = document.createElement("link")
      link.id = neshanCssId
      link.rel = "stylesheet"
      link.href = "https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.css"
      document.head.appendChild(link)
    }

    const existingScript = document.getElementById(
      neshanScriptId,
    ) as HTMLScriptElement | null

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.L) {
          resolve(window.L)
        } else {
          reject(new Error("Neshan SDK not found."))
        }
      })
      existingScript.addEventListener("error", () => {
        reject(new Error("Neshan SDK failed to load."))
      })
      return
    }

    const script = document.createElement("script")
    script.id = neshanScriptId
    script.src = "https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js"
    script.async = true
    script.onload = () => {
      if (window.L) {
        resolve(window.L)
      } else {
        reject(new Error("Neshan SDK not found."))
      }
    }
    script.onerror = () => reject(new Error("Neshan SDK failed to load."))
    document.body.appendChild(script)
  })

  return neshanLoader
}

export function isMapLocationValue(
  value: unknown,
): value is MapLocationValue {
  if (typeof value !== "object" || value === null) return false

  const location = value as Partial<MapLocationValue>
  return (
    typeof location.lat === "number" &&
    Number.isFinite(location.lat) &&
    typeof location.lng === "number" &&
    Number.isFinite(location.lng)
  )
}

export default function IranLocationPicker({
  title,
  value,
  required = false,
  error = false,
  readOnly = false,
  onChange,
}: IranLocationPickerProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<NeshanMap | null>(null)
  const markerRef = useRef<NeshanMarker | null>(null)
  const initialLocationRef = useRef(value || defaultLocation)
  const latestOnChangeRef = useRef(onChange)
  const [loadError, setLoadError] = useState(
    neshanMapKey ? "" : "کلید نقشه نشان تنظیم نشده است.",
  )
  const [isLoading, setIsLoading] = useState(Boolean(neshanMapKey))

  const selectedLocation = value || null

  useEffect(() => {
    latestOnChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!neshanMapKey) return

    const mapElement = mapElementRef.current
    if (!mapElement || mapRef.current) return

    let isMounted = true
    const initialLocation = initialLocationRef.current

    loadNeshanLeaflet()
      .then((leaflet) => {
        if (!isMounted || !mapElementRef.current) return

        const map = new leaflet.Map(mapElementRef.current, {
          key: neshanMapKey,
          maptype: neshanMapType,
          poi: true,
          traffic: false,
          center: [initialLocation.lat, initialLocation.lng],
          zoom: 14,
        })
        const marker = leaflet
          .marker([initialLocation.lat, initialLocation.lng], {
            draggable: !readOnly,
          })
          .addTo(map)

        if (!readOnly) {
          map.on("click", (event) => {
            const nextLocation = normalizeLocation(event.latlng)
            marker.setLatLng(nextLocation)
            map.panTo([nextLocation.lat, nextLocation.lng])
            latestOnChangeRef.current?.(nextLocation)
          })

          marker.on("dragend", (event) => {
            const nextLocation = normalizeLocation(event.target.getLatLng())
            map.panTo([nextLocation.lat, nextLocation.lng])
            latestOnChangeRef.current?.(nextLocation)
          })
        }

        mapRef.current = map
        markerRef.current = marker
        setIsLoading(false)
      })
      .catch(() => {
        if (!isMounted) return
        setIsLoading(false)
        setLoadError("بارگذاری نقشه نشان ناموفق بود.")
      })

    return () => {
      isMounted = false
      mapRef.current?.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [readOnly])

  useEffect(() => {
    if (!value || !markerRef.current || !mapRef.current) return

    markerRef.current.setLatLng([value.lat, value.lng])
    mapRef.current.setView([value.lat, value.lng])
  }, [value])

  return (
    <div className={styles.mapPicker}>
      {title && (
        <div className={styles.multiSelectTitle}>
          {title}
          {required && <span className={styles.requiredMark}>*</span>}
        </div>
      )}

      <div
        className={`${styles.iranMapFrame} ${
          error ? styles.iranMapFrameError : ""
        }`}
      >
        <div
          ref={mapElementRef}
          className={`${styles.iranMap} ${
            readOnly ? styles.iranMapReadOnly : ""
          }`}
        />
        {(isLoading || loadError) && (
          <div className={styles.iranMapOverlay}>
            {isLoading ? "در حال بارگذاری نقشه نشان..." : loadError}
          </div>
        )}
      </div>

      <div className={styles.mapSelectedText}>
        {selectedLocation
          ? `${readOnly ? "موقعیت ثبت‌شده" : "موقعیت انتخاب‌شده"}: ${selectedLocation.lat.toLocaleString("fa-IR")}، ${selectedLocation.lng.toLocaleString("fa-IR")}`
          : readOnly
            ? "موقعیتی ثبت نشده است."
            : "برای انتخاب موقعیت، روی نقشه کلیک کنید یا نشانگر را جابه‌جا کنید."}
      </div>
    </div>
  )
}
