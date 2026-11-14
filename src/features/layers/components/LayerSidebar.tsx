
import { useState } from 'react'
import { Info, Layers, MapPin, X } from 'lucide-react'
import { LAYER_CATEGORIES, LAYERS } from '../layer.config'
import type { LayerId } from '../layer.config'
import type { SevesoSiteType } from '../../seveso/model/sevesoSite'
import { SevesoTypeFilters } from '../../seveso/components/SevesoTypeFilters'
import { LayerItem } from './LayerItem'

type LayerSidebarProps = {
    isOpen: boolean
    activeLayerIds: readonly LayerId[]
    enabledSevesoTypes: readonly SevesoSiteType[]
    onClose: () => void
    onLayerToggle: (layerId: LayerId) => void
    onSevesoTypeToggle: (siteType: SevesoSiteType) => void
}

type SidebarSection = 'map' | 'about'

export function LayerSidebar({
                                 isOpen,
                                 activeLayerIds,
                                 enabledSevesoTypes,
                                 onClose,
                                 onLayerToggle,
                                 onSevesoTypeToggle,
                             }: LayerSidebarProps) {
    const [selectedSection, setSelectedSection] =
        useState<SidebarSection>('map')

    return (
        <aside
            aria-label="Panel warstw i nawigacji"
            className={`fixed inset-y-0 left-0 z-40 flex h-dvh w-72 shrink-0 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 ease-out lg:static lg:z-10 lg:h-full lg:translate-x-0 lg:shadow-none ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
                <div className="flex items-center gap-3">
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

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Zamknij menu warstw"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex shrink-0 gap-1 border-b border-slate-200 p-3">
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

            <div className="shrink-0 border-t border-slate-200 p-4">
                <p className="text-xs text-slate-400">
                    Źródła danych: GIOŚ
                </p>
            </div>
        </aside>
    )
}
