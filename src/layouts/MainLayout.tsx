
import { useState } from 'react'
import {
    DEFAULT_ACTIVE_LAYER_IDS,
    type LayerId,
} from '../features/layers/layer.config'
import { LayerSidebar } from '../features/layers/components/LayerSidebar'
import { MapView } from '../features/map/components/MapView'
import { ObjectDetailsPanel } from '../features/objects/components/ObjectDetailsPanel'
import type {
    SevesoSite,
    SevesoSiteType,
} from '../features/seveso/model/sevesoSite'
import { AppHeader } from '../shared/components/AppHeader'

const DEFAULT_ENABLED_SEVESO_TYPES: SevesoSiteType[] = ['ZDR', 'ZZR']

export function MainLayout() {
    const [activeLayerIds, setActiveLayerIds] = useState<LayerId[]>([
        ...DEFAULT_ACTIVE_LAYER_IDS,
    ])

    const [enabledSevesoTypes, setEnabledSevesoTypes] = useState<
        SevesoSiteType[]
    >(DEFAULT_ENABLED_SEVESO_TYPES)

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSite, setSelectedSite] = useState<SevesoSite | null>(null)
    const [isLayerSidebarOpen, setIsLayerSidebarOpen] = useState(false)

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

    const handleSiteClose = () => {
        setSelectedSite(null)
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
                    onSearchChange={setSearchQuery}
                    onMenuClick={() => setIsLayerSidebarOpen(true)}
                />

                <div className="relative flex min-h-0 min-w-0 flex-1">
                    <MapView
                        activeLayerIds={activeLayerIds}
                        enabledSevesoTypes={enabledSevesoTypes}
                        selectedSite={selectedSite}
                        onSiteSelect={setSelectedSite}
                    />

                    <ObjectDetailsPanel
                        site={selectedSite}
                        onClose={handleSiteClose}
                    />
                </div>
            </main>
        </div>
    )
}
