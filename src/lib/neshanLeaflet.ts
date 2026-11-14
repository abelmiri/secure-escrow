export interface NeshanLatLng {
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

export interface NeshanMarker {
  addTo: (map: NeshanMap) => NeshanMarker
  setLatLng: (latLng: [number, number] | NeshanLatLng) => NeshanMarker
  getLatLng: () => NeshanLatLng
  on: (
    eventName: "dragend",
    handler: (event: NeshanMarkerEvent) => void,
  ) => void
}

export interface NeshanMap {
  on: (eventName: "click", handler: (event: NeshanMapEvent) => void) => void
  panTo: (latLng: [number, number]) => void
  setView: (latLng: [number, number], zoom?: number) => void
  remove: () => void
}

export interface NeshanLeaflet {
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

export const neshanMapKey = process.env.NEXT_PUBLIC_NESHAN_MAP_KEY || ""
export const neshanMapType =
  process.env.NEXT_PUBLIC_NESHAN_MAP_TYPE || "standard-day"

const neshanCssId = "neshan-leaflet-css"
const neshanScriptId = "neshan-leaflet-script"
let neshanLoader: Promise<NeshanLeaflet> | null = null

export const loadNeshanLeaflet = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Neshan map is available in browser only."))
  }

  if (window.L) return Promise.resolve(window.L)
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
