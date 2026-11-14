
import { useEffect, useRef, useState } from 'react'
import {
    Map as MapLibreMap,
    NavigationControl,
    type GeoJSONSource,
} from 'maplibre-gl'
import { MapPin } from 'lucide-react'
import type { LayerId } from '../../layers/layer.config'
import type {
    SevesoSite,
    SevesoSiteType,
} from '../../seveso/model/sevesoSite'
import type { PlaceSearchResult } from '../../places/model/place'
import { toSevesoFeatureCollection } from '../model/sevesoFeatureCollection'

const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

const MAP_CENTER: [number, number] = [19.1451, 52.0]
const INITIAL_ZOOM = 5
const MAX_ZOOM = 18
const FOCUS_ZOOM = 10

const MOBILE_VIEWPORT_QUERY = '(max-width: 767px)'

const SEVESO_SOURCE_ID = 'seveso-sites'
const ZDR_LAYER_ID = 'seveso-zdr'
const ZZR_LAYER_ID = 'seveso-zzr'

type MapViewProps = {
    sites: readonly SevesoSite[]
    activeLayerIds: readonly LayerId[]
    enabledSevesoTypes: readonly SevesoSiteType[]
    selectedSite: SevesoSite | null
    selectedPlace: PlaceSearchResult | null
    isSitesLoading: boolean
    hasSitesError: boolean
    onSiteSelect: (site: SevesoSite | null) => void
}

export function MapView({
                            sites,
                            activeLayerIds,
                            enabledSevesoTypes,
                            selectedSite,
                            selectedPlace,
                            isSitesLoading,
                            hasSitesError,
                            onSiteSelect,
                        }: MapViewProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<MapLibreMap | null>(null)
    const sitesRef = useRef(sites)
    const previousSelectedSiteIdRef = useRef<number | null>(null)

    const [isMapLoaded, setIsMapLoaded] = useState(false)

    sitesRef.current = sites

    const selectedSiteId = selectedSite?.sourceId ?? null

    useEffect(() => {
        const container = mapContainerRef.current

        if (!container) {
            return
        }

        const map = new MapLibreMap({
            container,
            style: MAP_STYLE_URL,
            center: MAP_CENTER,
            zoom: INITIAL_ZOOM,
            maxZoom: MAX_ZOOM,
        })

        mapRef.current = map

        map.addControl(
            new NavigationControl({
                showCompass: true,
                visualizePitch: false,
            }),
            'top-right',
        )

        map.on('error', ({ error }) => {
            console.error('[MapLibre] Map error:', error)
        })

        map.once('load', () => {
            map.addSource(SEVESO_SOURCE_ID, {
                type: 'geojson',
                data: toSevesoFeatureCollection([]),
            })

            map.addLayer({
                id: ZDR_LAYER_ID,
                type: 'circle',
                source: SEVESO_SOURCE_ID,
                filter: ['==', ['get', 'siteType'], 'ZDR'],
                paint: {
                    'circle-radius': [
                        'case',
                        ['boolean', ['feature-state', 'selected'], false],
                        11,
                        8,
                    ],
                    'circle-color': [
                        'case',
                        ['boolean', ['feature-state', 'selected'], false],
                        '#2563eb',
                        '#dc2626',
                    ],
                    'circle-stroke-color': '#ffffff',
                    'circle-stroke-width': [
                        'case',
                        ['boolean', ['feature-state', 'selected'], false],
                        3,
                        2,
                    ],
                },
            })

            map.addLayer({
                id: ZZR_LAYER_ID,
                type: 'circle',
                source: SEVESO_SOURCE_ID,
                filter: ['==', ['get', 'siteType'], 'ZZR'],
                paint: {
                    'circle-radius': [
                        'case',
                        ['boolean', ['feature-state', 'selected'], false],
                        11,
                        8,
                    ],
                    'circle-color': [
                        'case',
                        ['boolean', ['feature-state', 'selected'], false],
                        '#2563eb',
                        '#f59e0b',
                    ],
                    'circle-stroke-color': '#ffffff',
                    'circle-stroke-width': [
                        'case',
                        ['boolean', ['feature-state', 'selected'], false],
                        3,
                        2,
                    ],
                },
            })

            const handleSiteClick = (
                featureId: string | number | undefined,
            ) => {
                if (
                    typeof featureId !== 'number' ||
                    !Number.isInteger(featureId)
                ) {
                    return
                }

                const site = sitesRef.current.find(
                    (currentSite) => currentSite.sourceId === featureId,
                )

                if (site) {
                    onSiteSelect(site)
                }
            }

            map.on('click', ZDR_LAYER_ID, (event) => {
                handleSiteClick(event.features?.[0]?.id)
            })

            map.on('click', ZZR_LAYER_ID, (event) => {
                handleSiteClick(event.features?.[0]?.id)
            })

            map.on('click', (event) => {
                const features = map.queryRenderedFeatures(event.point, {
                    layers: [ZDR_LAYER_ID, ZZR_LAYER_ID],
                })

                if (features.length === 0) {
                    onSiteSelect(null)
                }
            })

            for (const layerId of [ZDR_LAYER_ID, ZZR_LAYER_ID]) {
                map.on('mouseenter', layerId, () => {
                    map.getCanvas().style.cursor = 'pointer'
                })

                map.on('mouseleave', layerId, () => {
                    map.getCanvas().style.cursor = ''
                })
            }

            setIsMapLoaded(true)
        })

        return () => {
            map.remove()
            mapRef.current = null
            previousSelectedSiteIdRef.current = null
        }
    }, [onSiteSelect])

    useEffect(() => {
        const map = mapRef.current

        if (!map || !isMapLoaded) {
            return
        }

        const source = map.getSource(SEVESO_SOURCE_ID)

        if (!source || source.type !== 'geojson') {
            return
        }

        void (source as GeoJSONSource)
            .setData(toSevesoFeatureCollection(sites))
            .catch((error: unknown) => {
                console.error('[SEVESO] Failed to update map data:', error)
            })
    }, [sites, isMapLoaded])

    useEffect(() => {
        const map = mapRef.current

        if (!map || !isMapLoaded) {
            return
        }

        const previousSelectedSiteId = previousSelectedSiteIdRef.current

        if (previousSelectedSiteId !== null) {
            map.removeFeatureState(
                {
                    source: SEVESO_SOURCE_ID,
                    id: previousSelectedSiteId,
                },
                'selected',
            )
        }

        if (selectedSiteId !== null) {
            map.setFeatureState(
                {
                    source: SEVESO_SOURCE_ID,
                    id: selectedSiteId,
                },
                {
                    selected: true,
                },
            )
        }

        previousSelectedSiteIdRef.current = selectedSiteId
    }, [selectedSiteId, isMapLoaded, sites])

    useEffect(() => {
        const map = mapRef.current

        if (!map || !isMapLoaded) {
            return
        }

        if (selectedSite) {
            map.stop()

            map.flyTo({
                center: [selectedSite.longitude, selectedSite.latitude],
                zoom: FOCUS_ZOOM,
                duration: 850,
                essential: true,
                offset: window.matchMedia(MOBILE_VIEWPORT_QUERY).matches
                    ? [0, -66]
                    : [0, 0],
            })

            return
        }

        if (!selectedPlace) {
            return
        }

        map.stop()

        if (selectedPlace.extent) {
            const [west, south, east, north] = selectedPlace.extent

            map.fitBounds(
                [
                    [west, south],
                    [east, north],
                ],
                {
                    padding: 80,
                    maxZoom: FOCUS_ZOOM,
                    duration: 850,
                },
            )

            return
        }

        map.flyTo({
            center: [selectedPlace.longitude, selectedPlace.latitude],
            zoom: FOCUS_ZOOM,
            duration: 850,
            essential: true,
        })
    }, [selectedSite, selectedPlace, isMapLoaded])

    useEffect(() => {
        const map = mapRef.current

        if (!map || !isMapLoaded) {
            return
        }

        const isSevesoLayerActive = activeLayerIds.includes('seveso')

        const zdrVisibility =
            isSevesoLayerActive && enabledSevesoTypes.includes('ZDR')
                ? 'visible'
                : 'none'

        const zzrVisibility =
            isSevesoLayerActive && enabledSevesoTypes.includes('ZZR')
                ? 'visible'
                : 'none'

        map.setLayoutProperty(ZDR_LAYER_ID, 'visibility', zdrVisibility)
        map.setLayoutProperty(ZZR_LAYER_ID, 'visibility', zzrVisibility)
    }, [activeLayerIds, enabledSevesoTypes, isMapLoaded])

    return (
        <section
            className="relative h-full min-h-0 min-w-0 flex-1 overflow-hidden bg-slate-100"
            aria-label="Mapa środowiskowa"
        >
            <div
                ref={mapContainerRef}
                className="absolute inset-0 h-full w-full"
            />

            <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-emerald-600" />
                    <span className="text-sm font-semibold">Mapa Polski</span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                    Interaktywna mapa środowiskowa
                </p>
            </div>

            <div className="pointer-events-none absolute bottom-5 left-5 z-10 flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <span className="text-xs font-medium text-slate-500">
          Źródło: GIOŚ
        </span>

                <span className="flex items-center gap-2 text-xs text-slate-600">
          <span className="h-3 w-3 rounded-full bg-red-600" />
          ZDR
        </span>

                <span className="flex items-center gap-2 text-xs text-slate-600">
          <span className="h-3 w-3 rounded-full bg-amber-500" />
          ZZR
        </span>

                {selectedSiteId !== null && (
                    <span className="flex items-center gap-2 text-xs font-medium text-blue-700">
            <span className="h-3 w-3 rounded-full bg-blue-600" />
            Wybrany
          </span>
                )}
            </div>

            {isSitesLoading && isMapLoaded && (
                <div className="absolute right-5 top-5 z-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
                    Ładowanie zakładów...
                </div>
            )}

            {hasSitesError && (
                <div
                    role="alert"
                    className="absolute right-5 top-5 z-10 max-w-xs rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-700 shadow-sm"
                >
                    Nie udało się pobrać danych zakładów SEVESO.
                </div>
            )}

            {!isMapLoaded && (
                <div
                    role="status"
                    className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
                >
                    <div className="rounded-lg bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                        Ładowanie mapy...
                    </div>
                </div>
            )}
        </section>
    )
}
