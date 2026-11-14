import { useState } from 'react'
import {
    DEFAULT_ACTIVE_LAYER_IDS,
    type LayerId,
} from '../features/layers/layer.config'
import { LayerSidebar } from '../features/layers/components/LayerSidebar'
import { MapView } from '../features/map/components/MapView'
import { ObjectDetailsPanel } from '../features/objects/components/ObjectDetailsPanel'
import { AppHeader } from '../shared/components/AppHeader'

export function MainLayout() {
    const [activeLayerIds, setActiveLayerIds] = useState<LayerId[]>([
        ...DEFAULT_ACTIVE_LAYER_IDS,
    ])
    const [searchQuery, setSearchQuery] = useState('')

    const handleLayerToggle = (layerId: LayerId) => {
        setActiveLayerIds((currentLayerIds) =>
            currentLayerIds.includes(layerId)
                ? currentLayerIds.filter((currentLayerId) => currentLayerId !== layerId)
                : [...currentLayerIds, layerId],
        )
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-900">
            <LayerSidebar
                activeLayerIds={activeLayerIds}
                onLayerToggle={handleLayerToggle}
            />

            <main className="flex min-h-0 min-w-0 flex-1 flex-col">
                <AppHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <div className="flex min-h-0 min-w-0 flex-1">
                    <MapView activeLayerIds={activeLayerIds} />
                    <ObjectDetailsPanel />
                </div>
            </main>
        </div>
    )
}