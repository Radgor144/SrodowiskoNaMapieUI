import { useState } from 'react'
import { Info, Layers, MapPin } from 'lucide-react'
import { LAYER_CATEGORIES, LAYERS } from '../layer.config'
import type { LayerId } from '../layer.config'
import type { SevesoSiteType } from '../../seveso/model/sevesoSite'
import { SevesoTypeFilters } from '../../seveso/components/SevesoTypeFilters'
import { LayerItem } from './LayerItem'

type LayerSidebarProps = {
    activeLayerIds: readonly LayerId[]
    enabledSevesoTypes: readonly SevesoSiteType[]
    onLayerToggle: (layerId: LayerId) => void
    onSevesoTypeToggle: (siteType: SevesoSiteType) => void
}

type SidebarSection = 'map' | 'about'

export function LayerSidebar({
                                 activeLayerIds,
                                 enabledSevesoTypes,
                                 onLayerToggle,
                                 onSevesoTypeToggle,
                             }: LayerSidebarProps) {
    const [selectedSection, setSelectedSection] =
        useState<SidebarSection>('map')

    return (
        <aside className="z-10 flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
            <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <MapPin size={21} />
                </div>

                <div>
                    <h1 className="text-base font-bold tracking-tight">
                        ŚrodowiskoNaMapie
                    </h1>
                    <p className="text-xs text-slate-500">
                        Dane o Twoim otoczeniu
                    </p>
                </div>
            </div>

            <nav className="flex gap-1 border-b border-slate-200 p-3">
                <button
                    type="button"
                    onClick={() => setSelectedSection('map')}
                    aria-pressed={selectedSection === 'map'}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium ${
                        selectedSection === 'map'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <Layers size={16} />
                    Mapa
                </button>

                <button
                    type="button"
                    onClick={() => setSelectedSection('about')}
                    aria-pressed={selectedSection === 'about'}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium ${
                        selectedSection === 'about'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <Info size={16} />
                    O projekcie
                </button>
            </nav>

            {selectedSection === 'map' ? (
                <div className="flex-1 space-y-6 overflow-y-auto p-4">
                    {LAYER_CATEGORIES.map((category) => {
                        const categoryLayers = LAYERS.filter(
                            (layer) => layer.category === category.id,
                        )

                        return (
                            <section key={category.id}>
                                <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                                    {category.label}
                                </h2>

                                <div className="space-y-1">
                                    {categoryLayers.map((layer) => {
                                        const Icon = layer.icon
                                        const isActive = activeLayerIds.includes(layer.id)

                                        return (
                                            <div key={layer.id}>
                                                <LayerItem
                                                    icon={<Icon size={19} />}
                                                    label={layer.label}
                                                    description={layer.description}
                                                    active={isActive}
                                                    onToggle={() => onLayerToggle(layer.id)}
                                                />

                                                {layer.id === 'seveso' && isActive && (
                                                    <SevesoTypeFilters
                                                        enabledSiteTypes={enabledSevesoTypes}
                                                        onSiteTypeToggle={onSevesoTypeToggle}
                                                    />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>
                        )
                    })}
                </div>
            ) : (
                <div className="p-5">
                    <h2 className="text-sm font-semibold">O projekcie</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        ŚrodowiskoNaMapie to platforma prezentująca dane środowiskowe
                        i informacje o otoczeniu na interaktywnej mapie Polski.
                    </p>
                </div>
            )}

            <div className="border-t border-slate-200 p-4">
                <p className="text-xs text-slate-400">
                    Źródła danych: GIOŚ
                </p>
            </div>
        </aside>
    )
}
