import type { MouseEvent } from "react"
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
  onChange: (value: MapLocationValue) => void
}

const mapBounds = {
  minLat: 25,
  maxLat: 39.8,
  minLng: 44,
  maxLng: 63.5,
}

const mapSize = {
  width: 360,
  height: 240,
}

const iranOutline =
  "M75 78 L96 48 L137 34 L181 41 L214 27 L250 50 L285 68 L302 101 L332 130 L313 160 L272 168 L251 204 L211 213 L176 196 L137 207 L104 184 L78 151 L53 132 L62 101 Z"

const provinceLines = [
  "M96 48 L118 82 L96 116 L62 101",
  "M137 34 L146 76 L118 82",
  "M181 41 L170 86 L146 76",
  "M214 27 L215 78 L170 86",
  "M250 50 L246 91 L215 78",
  "M285 68 L272 112 L246 91",
  "M302 101 L272 112 L282 146 L313 160",
  "M118 82 L137 118 L96 116",
  "M146 76 L170 86 L166 126 L137 118",
  "M215 78 L207 126 L166 126",
  "M246 91 L235 132 L207 126",
  "M272 112 L282 146 L235 132",
  "M96 116 L118 154 L78 151",
  "M137 118 L141 162 L118 154",
  "M166 126 L176 166 L141 162",
  "M207 126 L211 170 L176 166",
  "M235 132 L251 169 L211 170",
  "M282 146 L272 168 L251 169",
  "M118 154 L137 207",
  "M176 166 L176 196",
  "M211 170 L211 213",
]

const cities = [
  { name: "تهران", lat: 35.6892, lng: 51.389 },
  { name: "مشهد", lat: 36.2605, lng: 59.6168 },
  { name: "اصفهان", lat: 32.6546, lng: 51.668 },
  { name: "شیراز", lat: 29.5918, lng: 52.5837 },
  { name: "تبریز", lat: 38.0962, lng: 46.2738 },
  { name: "اهواز", lat: 31.3183, lng: 48.6706 },
  { name: "بندرعباس", lat: 27.1832, lng: 56.2666 },
]

const roundCoordinate = (value: number) => Math.round(value * 100000) / 100000

const locationToPoint = (location: MapLocationValue) => ({
  x:
    ((location.lng - mapBounds.minLng) /
      (mapBounds.maxLng - mapBounds.minLng)) *
    mapSize.width,
  y:
    ((mapBounds.maxLat - location.lat) /
      (mapBounds.maxLat - mapBounds.minLat)) *
    mapSize.height,
})

const pointToLocation = (x: number, y: number): MapLocationValue => ({
  lat: roundCoordinate(
    mapBounds.maxLat -
      (y / mapSize.height) * (mapBounds.maxLat - mapBounds.minLat),
  ),
  lng: roundCoordinate(
    mapBounds.minLng +
      (x / mapSize.width) * (mapBounds.maxLng - mapBounds.minLng),
  ),
})

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
  onChange,
}: IranLocationPickerProps) {
  const selectedPoint = value ? locationToPoint(value) : null

  const handleMapClick = (event: MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * mapSize.width
    const y = ((event.clientY - rect.top) / rect.height) * mapSize.height

    onChange(pointToLocation(x, y))
  }

  return (
    <div className={styles.mapPicker}>
      <div className={styles.multiSelectTitle}>
        {title}
        {required && <span className={styles.requiredMark}>*</span>}
      </div>

      <div
        className={`${styles.iranMapFrame} ${
          error ? styles.iranMapFrameError : ""
        }`}
      >
        <svg
          viewBox={`0 0 ${mapSize.width} ${mapSize.height}`}
          className={styles.iranMap}
          role="button"
          tabIndex={0}
          aria-label="انتخاب موقعیت روی نقشه ایران"
          onClick={handleMapClick}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              onChange({ lat: 35.6892, lng: 51.389 })
            }
          }}
        >
          <rect width="360" height="240" className={styles.iranMapSea} />
          <path d={iranOutline} className={styles.iranMapLand} />
          {provinceLines.map((line) => (
            <path key={line} d={line} className={styles.iranMapProvinceLine} />
          ))}
          {cities.map((city) => {
            const point = locationToPoint(city)

            return (
              <g key={city.name} className={styles.iranMapCity}>
                <circle cx={point.x} cy={point.y} r="2.4" />
                <text x={point.x + 4} y={point.y - 4}>
                  {city.name}
                </text>
              </g>
            )
          })}
          <text x="96" y="34" className={styles.iranMapWaterLabel}>
            دریای خزر
          </text>
          <text x="98" y="224" className={styles.iranMapWaterLabel}>
            خلیج فارس
          </text>
          <text x="228" y="226" className={styles.iranMapWaterLabel}>
            دریای عمان
          </text>
          {selectedPoint && (
            <g className={styles.iranMapMarker}>
              <circle cx={selectedPoint.x} cy={selectedPoint.y} r="9" />
              <circle cx={selectedPoint.x} cy={selectedPoint.y} r="4" />
            </g>
          )}
        </svg>
      </div>

      <div className={styles.mapSelectedText}>
        {value
          ? `موقعیت انتخاب‌شده: ${value.lat.toLocaleString("fa-IR")}، ${value.lng.toLocaleString("fa-IR")}`
          : "برای انتخاب موقعیت، روی نقشه کلیک کنید."}
      </div>
    </div>
  )
}
