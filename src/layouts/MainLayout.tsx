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
        <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-900">
            <LayerSidebar
                activeLayerIds={activeLayerIds}
                enabledSevesoTypes={enabledSevesoTypes}
                onLayerToggle={handleLayerToggle}
                onSevesoTypeToggle={handleSevesoTypeToggle}
            />

            <main className="flex min-h-0 min-w-0 flex-1 flex-col">
                <AppHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <div className="flex min-h-0 min-w-0 flex-1">
                    <MapView
                        activeLayerIds={activeLayerIds}
                        enabledSevesoTypes={enabledSevesoTypes}
                        selectedSiteId={selectedSite?.sourceId ?? null}
                        onSiteSelect={setSelectedSite}
                    />

                    <ObjectDetailsPanel site={selectedSite} />
                </div>
            </main>
        </div>
    )
}
