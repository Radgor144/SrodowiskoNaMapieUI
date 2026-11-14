
import { useCallback, useState } from 'react'
import {
    DEFAULT_ACTIVE_LAYER_IDS,
    type LayerId,
} from '../features/layers/layer.config'
import { LayerSidebar } from '../features/layers/components/LayerSidebar'
import { MapView } from '../features/map/components/MapView'
import { ObjectDetailsPanel } from '../features/objects/components/ObjectDetailsPanel'
import type { PlaceSearchResult } from '../features/places/model/place'
import type {
    SevesoSite,
    SevesoSiteType,
} from '../features/seveso/model/sevesoSite'
import { useSevesoSites } from '../features/seveso/hooks/useSevesoSites'
import { AppHeader } from '../shared/components/AppHeader'

const DEFAULT_ENABLED_SEVESO_TYPES: SevesoSiteType[] = ['ZDR', 'ZZR']
const EMPTY_SEVESO_SITES: SevesoSite[] = []

export function MainLayout() {
    const {
        data: loadedSites,
        isPending,
        isError,
    } = useSevesoSites()

    const sites = loadedSites ?? EMPTY_SEVESO_SITES

    const [activeLayerIds, setActiveLayerIds] = useState<LayerId[]>([
        ...DEFAULT_ACTIVE_LAYER_IDS,
    ])

    const [enabledSevesoTypes, setEnabledSevesoTypes] = useState<
        SevesoSiteType[]
    >(DEFAULT_ENABLED_SEVESO_TYPES)

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSite, setSelectedSite] = useState<SevesoSite | null>(null)
    const [selectedPlace, setSelectedPlace] = useState<PlaceSearchResult | null>(null)
    const [isLayerSidebarOpen, setIsLayerSidebarOpen] = useState(false)

    const handleMapSiteSelect = useCallback((site: SevesoSite | null) => {
        setSelectedSite(site)
        setSelectedPlace(null)
    }, [])

    const handleSearchSiteSelect = useCallback((site: SevesoSite) => {
        setSelectedPlace(null)
        setSelectedSite(site)
    }, [])

    const handleSearchPlaceSelect = useCallback((place: PlaceSearchResult) => {
        setSelectedSite(null)
        setSelectedPlace(place)
    }, [])

    const handleLayerToggle = (layerId: LayerId) => {
        const isCurrentlyActive = activeLayerIds.includes(layerId)

        setActiveLayerIds((currentLayerIds) =>
            isCurrentlyActive
                ? currentLayerIds.filter((currentLayerId) => currentLayerId !== layerId)
                : [...currentLayerIds, layerId],
        )

        if (layerId === 'seveso' && isCurrentlyActive) {
            setSelectedSite(null)
        }
    }

    const handleSevesoTypeToggle = (siteType: SevesoSiteType) => {
        const isCurrentlyEnabled = enabledSevesoTypes.includes(siteType)

        setEnabledSevesoTypes((currentSiteTypes) =>
            isCurrentlyEnabled
                ? currentSiteTypes.filter((currentSiteType) => currentSiteType !== siteType)
                : [...currentSiteTypes, siteType],
        )

        if (isCurrentlyEnabled) {
            setSelectedSite((currentSite) =>
                currentSite?.siteType === siteType ? null : currentSite,
            )
        }
    }

    return (
        <div className="flex h-dvh w-screen overflow-hidden bg-slate-100 text-slate-900">
            {isLayerSidebarOpen && (
                <button
                    type="button"
                    aria-label="Zamknij menu warstw"
                    onClick={() => setIsLayerSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
                />
            )}

            <LayerSidebar
                isOpen={isLayerSidebarOpen}
                activeLayerIds={activeLayerIds}
                enabledSevesoTypes={enabledSevesoTypes}
                onClose={() => setIsLayerSidebarOpen(false)}
                onLayerToggle={handleLayerToggle}
                onSevesoTypeToggle={handleSevesoTypeToggle}
            />

            <main className="flex min-h-0 min-w-0 flex-1 flex-col">
                <AppHeader
                    searchQuery={searchQuery}
                    sites={sites}
                    isSitesLoading={isPending}
                    onSearchChange={setSearchQuery}
                    onSiteSelect={handleSearchSiteSelect}
                    onPlaceSelect={handleSearchPlaceSelect}
                    onMenuClick={() => setIsLayerSidebarOpen(true)}
                />

                <div className="relative flex min-h-0 min-w-0 flex-1">
                    <MapView
                        sites={sites}
                        activeLayerIds={activeLayerIds}
                        enabledSevesoTypes={enabledSevesoTypes}
                        selectedSite={selectedSite}
                        selectedPlace={selectedPlace}
                        isSitesLoading={isPending}
                        hasSitesError={isError}
                        onSiteSelect={handleMapSiteSelect}
                    />

                    <ObjectDetailsPanel
                        site={selectedSite}
                        onClose={() => setSelectedSite(null)}
                    />
                </div>
            </main>
        </div>
    )
}
