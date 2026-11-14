import { useEffect, useRef, useState } from 'react'
import { Map as MapLibreMap, NavigationControl } from 'maplibre-gl'
import { MapPin } from 'lucide-react'
import { SEVESO_DEMO_DATA } from '../../seveso/data/sevesoDemoData'
import type { LayerId } from '../../layers/layer.config'

const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

const MAP_CENTER: [number, number] = [19.1451, 52.0]
const INITIAL_ZOOM = 5

const SEVESO_SOURCE_ID = 'seveso-sites'
const ZDR_LAYER_ID = 'seveso-zdr'
const ZZR_LAYER_ID = 'seveso-zzr'

type MapViewProps = {
    activeLayerIds: readonly LayerId[]
}

export function MapView({ activeLayerIds }: MapViewProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<MapLibreMap | null>(null)

    const [isMapLoaded, setIsMapLoaded] = useState(false)

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
                data: SEVESO_DEMO_DATA,
            })

            map.addLayer({
                id: ZDR_LAYER_ID,
                type: 'circle',
                source: SEVESO_SOURCE_ID,
                filter: ['==', ['get', 'siteType'], 'ZDR'],
                paint: {
                    'circle-radius': 8,
                    'circle-color': '#dc2626',
                    'circle-stroke-color': '#ffffff',
                    'circle-stroke-width': 2,
                },
            })

            map.addLayer({
                id: ZZR_LAYER_ID,
                type: 'circle',
                source: SEVESO_SOURCE_ID,
                filter: ['==', ['get', 'siteType'], 'ZZR'],
                paint: {
                    'circle-radius': 8,
                    'circle-color': '#f59e0b',
                    'circle-stroke-color': '#ffffff',
                    'circle-stroke-width': 2,
                },
            })

            setIsMapLoaded(true)
        })

        return () => {
            map.remove()
            mapRef.current = null
        }
    }, [])

    useEffect(() => {
        const map = mapRef.current

        if (!map || !isMapLoaded) {
            return
        }

        const visibility = activeLayerIds.includes('seveso')
            ? 'visible'
            : 'none'

        map.setLayoutProperty(ZDR_LAYER_ID, 'visibility', visibility)
        map.setLayoutProperty(ZZR_LAYER_ID, 'visibility', visibility)
    }, [activeLayerIds, isMapLoaded])

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

                    <span className="text-sm font-semibold">
            Mapa Polski
          </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                    Interaktywna mapa środowiskowa
                </p>
            </div>

            <div className="pointer-events-none absolute bottom-5 left-5 z-10 flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <span className="text-xs font-medium text-slate-500">
          Dane demonstracyjne
        </span>

                <span className="flex items-center gap-2 text-xs text-slate-600">
          <span className="h-3 w-3 rounded-full bg-red-600" />
          ZDR
        </span>

                <span className="flex items-center gap-2 text-xs text-slate-600">
          <span className="h-3 w-3 rounded-full bg-amber-500" />
          ZZR
        </span>
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