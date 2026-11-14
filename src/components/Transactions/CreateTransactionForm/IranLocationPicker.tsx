"use client"

import { useEffect, useRef, useState } from "react"
import {
  loadNeshanLeaflet,
  neshanMapKey,
  neshanMapType,
  type NeshanLatLng,
  type NeshanMap,
  type NeshanMarker,
} from "@/lib/neshanLeaflet"
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

const defaultLocation: MapLocationValue = { lat: 35.6892, lng: 51.389 }

const roundCoordinate = (value: number) => Math.round(value * 100000) / 100000

const formatCoordinate = (value: number) =>
  value.toLocaleString("fa-IR", {
    maximumFractionDigits: 6,
    useGrouping: false,
  })

const normalizeLocation = (location: NeshanLatLng): MapLocationValue => ({
  lat: roundCoordinate(location.lat),
  lng: roundCoordinate(location.lng),
})

export function isMapLocationValue(value: unknown): value is MapLocationValue {
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
          ? `${readOnly ? "موقعیت ثبت‌شده" : "موقعیت انتخاب‌شده"}: ${formatCoordinate(selectedLocation.lat)}، ${formatCoordinate(selectedLocation.lng)}`
          : readOnly
            ? "موقعیتی ثبت نشده است."
            : "برای انتخاب موقعیت، روی نقشه کلیک کنید یا نشانگر را جابه‌جا کنید."}
      </div>
    </div>
  )
}
