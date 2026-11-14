"use client"

import { useEffect, useRef, useState } from "react"
import {
  loadNeshanLeaflet,
  neshanMapKey,
  neshanMapType,
  type NeshanMap,
} from "@/lib/neshanLeaflet"
import styles from "./page.module.scss"

const tehranCenter: [number, number] = [35.6892, 51.389]

export default function NeshanTehranMap() {
  const mapElementRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<NeshanMap | null>(null)
  const [loadError, setLoadError] = useState(
    neshanMapKey ? "" : "نقشه در دسترس نیست",
  )
  const [isLoading, setIsLoading] = useState(Boolean(neshanMapKey))

  useEffect(() => {
    if (!neshanMapKey || !mapElementRef.current) return

    let isMounted = true

    loadNeshanLeaflet()
      .then((leaflet) => {
        if (!isMounted || !mapElementRef.current) return

        mapRef.current = new leaflet.Map(mapElementRef.current, {
          key: neshanMapKey,
          maptype: neshanMapType,
          poi: true,
          traffic: false,
          center: tehranCenter,
          zoom: 10,
        })
        setIsLoading(false)
      })
      .catch(() => {
        if (!isMounted) return
        setIsLoading(false)
        setLoadError("نقشه در دسترس نیست")
      })

    return () => {
      isMounted = false
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className={styles.mapFrame}>
      <div
        ref={mapElementRef}
        className={styles.mapCanvas}
        role="img"
        aria-label="نقشه شهر تهران در نشان"
      />
      {(isLoading || loadError) && (
        <div className={styles.mapOverlay} aria-live="polite">
          {isLoading ? "در حال بارگذاری نقشه..." : loadError}
        </div>
      )}
    </div>
  )
}
