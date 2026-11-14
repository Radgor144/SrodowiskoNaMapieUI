
import { Bell, Menu } from 'lucide-react'
import type { SevesoSite } from '../../features/seveso/model/sevesoSite'
import type { PlaceSearchResult } from '../../features/places/model/place'
import { GlobalSearch } from '../../features/search/components/GlobalSearch'

type AppHeaderProps = {
    searchQuery: string
    sites: readonly SevesoSite[]
    isSitesLoading: boolean
    onSearchChange: (value: string) => void
    onSiteSelect: (site: SevesoSite) => void
    onPlaceSelect: (place: PlaceSearchResult) => void
    onMenuClick: () => void
}

export function AppHeader({
                              searchQuery,
                              sites,
                              isSitesLoading,
                              onSearchChange,
                              onSiteSelect,
                              onPlaceSelect,
                              onMenuClick,
                          }: AppHeaderProps) {
    return (
        <header className="relative z-20 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 sm:h-16 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Otwórz menu warstw"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 lg:hidden"
                >
                    <Menu size={21} />
                </button>

                <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold">
                        Mapa środowiskowa Polski
                    </h2>

                    <p className="hidden text-xs text-slate-500 sm:block">
                        Dane środowiskowe w jednym miejscu
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-5">
                <GlobalSearch
                    query={searchQuery}
                    sites={sites}
                    isSitesLoading={isSitesLoading}
                    onQueryChange={onSearchChange}
                    onSiteSelect={onSiteSelect}
                    onPlaceSelect={onPlaceSelect}
                />

                <button
                    type="button"
                    aria-label="Powiadomienia"
                    className="hidden text-slate-500 transition hover:text-slate-900 sm:inline-flex"
                >
                    <Bell size={20} />
                </button>
            </div>
        </header>
    )
}
