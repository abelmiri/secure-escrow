import { useEffect, useState } from "react"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"

export interface Province {
  id: number
  name: string
}

export interface City {
  id: string
  name: string
  province_id: number
}

export function useLocation() {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  const fetchProvinces = () => {
    setIsLoadingProvinces(true)
    request
      .get({ url: API_URLS.province })
      .then((data) => {
        // Based on the example provided by user: { "provinces": [...] }
        setProvinces(data.provinces || [])
      })
      .catch(() => setProvinces([]))
      .finally(() => setIsLoadingProvinces(false))
  }

  const fetchCities = (provinceId: number) => {
    if (!provinceId) {
      setCities([])
      return
    }
    setIsLoadingCities(true)
    request
      .get({ url: API_URLS.city({ id: provinceId }) })
      .then((data) => {
        // Based on the example provided by user: { "cities": [...] }
        setCities(data.cities || [])
      })
      .catch(() => setCities([]))
      .finally(() => setIsLoadingCities(false))
  }

  useEffect(() => {
    fetchProvinces()
  }, [])

  return {
    provinces,
    cities,
    isLoadingProvinces,
    isLoadingCities,
    fetchCities,
  }
}
