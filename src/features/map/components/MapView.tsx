
import { useEffect, useRef, useState } from 'react'
import { Map as MapLibreMap, NavigationControl } from 'maplibre-gl'
import { MapPin } from 'lucide-react'
import type { LayerId } from '../../layers/layer.config'
import type {
    SevesoSite,
    SevesoSiteType,
} from '../../seveso/model/sevesoSite'
import { parseSevesoSiteFeature } from '../../seveso/model/sevesoSite'

const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'
const SEVESO_DATA_URL = `${import.meta.env.BASE_URL}data/seveso.geojson`

const MAP_CENTER: [number, number] = [19.1451, 52.0]
const INITIAL_ZOOM = 5
const SITE_ZOOM = 10

const SEVESO_SOURCE_ID = 'seveso-sites'
const ZDR_LAYER_ID = 'seveso-zdr'
const ZZR_LAYER_ID = 'seveso-zzr'

type MapViewProps = {
    activeLayerIds: readonly LayerId[]
    enabledSevesoTypes: readonly SevesoSiteType[]
    selectedSite: SevesoSite | null
    onSiteSelect: (site: SevesoSite | null) => void
}

export function MapView({
                            activeLayerIds,
                            enabledSevesoTypes,
                            selectedSite,
                            onSiteSelect,
                        }: MapViewProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<MapLibreMap | null>(null)
    const previousSelectedSiteIdRef = useRef<number | null>(null)

    const [isMapLoaded, setIsMapLoaded] = useState(false)

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
            minZoom: 4,
            maxZoom: 18,
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
                data: SEVESO_DATA_URL,
                promoteId: 'ifcid',
            })

            map.addLayer({
                id: ZDR_LAYER_ID,
                type: 'circle',
                source: SEVESO_SOURCE_ID,
                filter: ['==', ['get', 'sevesotype'], 'ZDR'],
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
                filter: ['==', ['get', 'sevesotype'], 'ZZR'],
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

            map.on('click', ZDR_LAYER_ID, (event) => {
                const site = parseSevesoSiteFeature(event.features?.[0])

                if (site) {
                    onSiteSelect(site)
                }
            })

            map.on('click', ZZR_LAYER_ID, (event) => {
                const site = parseSevesoSiteFeature(event.features?.[0])

                if (site) {
                    onSiteSelect(site)
                }
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
    }, [selectedSiteId, isMapLoaded])

    useEffect(() => {
        const map = mapRef.current

        if (!map || !isMapLoaded || !selectedSite) {
            return
        }

        const isMobileViewport = window.matchMedia(
            '(max-width: 1023px)',
        ).matches

        const offset: [number, number] = isMobileViewport
            ? [0, -66]
            : [0, 0]

        map.flyTo({
            center: [selectedSite.longitude, selectedSite.latitude],
            zoom: Math.max(map.getZoom(), SITE_ZOOM),
            offset,
            duration: 700,
        })
    }, [selectedSite, isMapLoaded])

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
