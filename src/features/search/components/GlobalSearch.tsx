
import { useId, useMemo, useState } from 'react'
import {
    ArrowLeft,
    Factory,
    LoaderCircle,
    MapPin,
    Search,
    X,
} from 'lucide-react'
import type { SevesoSite } from '../../seveso/model/sevesoSite'
import type { PlaceSearchResult } from '../../places/model/place'
import { usePlaceSearch } from '../../places/hooks/usePlaceSearch'

type GlobalSearchProps = {
    query: string
    sites: readonly SevesoSite[]
    isSitesLoading: boolean
    onQueryChange: (value: string) => void
    onSiteSelect: (site: SevesoSite) => void
    onPlaceSelect: (place: PlaceSearchResult) => void
}

type SearchResultsProps = {
    id: string
    query: string
    sites: readonly SevesoSite[]
    places: readonly PlaceSearchResult[]
    isSitesLoading: boolean
    isPlacesLoading: boolean
    isPlacesDebouncing: boolean
    isPlacesError: boolean
    onSiteSelect: (site: SevesoSite) => void
    onPlaceSelect: (place: PlaceSearchResult) => void
}

function normalizeSearchText(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pl-PL')
}

function SearchResults({
                           id,
                           query,
                           sites,
                           places,
                           isSitesLoading,
                           isPlacesLoading,
                           isPlacesDebouncing,
                           isPlacesError,
                           onSiteSelect,
                           onPlaceSelect,
                       }: SearchResultsProps) {
    const hasResults = sites.length > 0 || places.length > 0
    const showLoading = isPlacesLoading || isPlacesDebouncing

    return (
        <div
            id={id}
            role="listbox"
            aria-label="Wyniki wyszukiwania"
            onMouseDown={(event) => event.preventDefault()}
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(65vh,420px)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
        >
            {query.trim().length === 0 ? (
                <p className="p-3 text-sm text-slate-500">
                    Wpisz nazwę zakładu lub miejscowości.
                </p>
            ) : query.trim().length < 2 ? (
                <p className="p-3 text-sm text-slate-500">
                    Wpisz co najmniej 2 znaki.
                </p>
            ) : (
                <>
                    {sites.length > 0 && (
                        <section>
                            <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Zakłady SEVESO
                            </h3>

                            {sites.map((site) => (
                                <button
                                    key={site.sourceId}
                                    type="button"
                                    role="option"
                                    aria-selected={false}
                                    onClick={() => onSiteSelect(site)}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-slate-50"
                                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Factory size={18} />
                  </span>

                                    <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-800">
                      {site.name}
                    </span>

                    <span className="mt-0.5 block text-xs text-slate-500">
                      {site.siteType} · Identyfikator GIOŚ: {site.sourceId}
                    </span>
                  </span>

                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                            site.siteType === 'ZDR'
                                                ? 'bg-red-50 text-red-700'
                                                : 'bg-amber-50 text-amber-700'
                                        }`}
                                    >
                    {site.siteType}
                  </span>
                                </button>
                            ))}
                        </section>
                    )}

                    {places.length > 0 && (
                        <section
                            className={
                                sites.length > 0
                                    ? 'mt-2 border-t border-slate-100 pt-2'
                                    : ''
                            }
                        >
                            <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Miejscowości
                            </h3>

                            {places.map((place) => (
                                <button
                                    key={place.id}
                                    type="button"
                                    role="option"
                                    aria-selected={false}
                                    onClick={() => onPlaceSelect(place)}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-slate-50"
                                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <MapPin size={18} />
                  </span>

                                    <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-800">
                      {place.name}
                    </span>

                    <span className="mt-0.5 block truncate text-xs text-slate-500">
                      {place.context || 'Polska'} · {place.placeTypeLabel}
                    </span>
                  </span>
                                </button>
                            ))}
                        </section>
                    )}

                    {query.trim().length === 2 && (
                        <p className="px-3 py-2 text-xs text-slate-400">
                            Wpisz jeszcze jeden znak, aby wyszukać miejscowości.
                        </p>
                    )}

                    {(isSitesLoading || showLoading) && (
                        <div className="flex items-center gap-2 px-3 py-3 text-sm text-slate-500">
                            <LoaderCircle size={16} className="animate-spin" />
                            Wyszukiwanie...
                        </div>
                    )}

                    {isPlacesError && !showLoading && (
                        <p className="px-3 py-2 text-sm text-red-600">
                            Nie udało się wyszukać miejscowości.
                        </p>
                    )}

                    {!hasResults &&
                        !isSitesLoading &&
                        !showLoading &&
                        !isPlacesError && (
                            <p className="px-3 py-3 text-sm text-slate-500">
                                Nie znaleziono wyników.
                            </p>
                        )}
                </>
            )}
        </div>
    )
}

export function GlobalSearch({
                                 query,
                                 sites,
                                 isSitesLoading,
                                 onQueryChange,
                                 onSiteSelect,
                                 onPlaceSelect,
                             }: GlobalSearchProps) {
    const [isDesktopFocused, setIsDesktopFocused] = useState(false)
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

    const searchId = useId()

    const {
        data: loadedPlaces = [],
        isFetching: isPlacesLoading,
        isDebouncing,
        isError: isPlacesError,
    } = usePlaceSearch(query)

    const normalizedQuery = normalizeSearchText(query.trim())

    const matchingSites = useMemo(() => {
        if (normalizedQuery.length < 2) {
            return []
        }

        return sites
            .filter((site) => {
                const searchableValues = [
                    site.name,
                    site.activityCode ?? '',
                    String(site.sourceId),
                ]

                return searchableValues.some((value) =>
                    normalizeSearchText(value).includes(normalizedQuery),
                )
            })
            .sort((first, second) => {
                const firstStartsWith = normalizeSearchText(first.name).startsWith(
                    normalizedQuery,
                )
                const secondStartsWith = normalizeSearchText(second.name).startsWith(
                    normalizedQuery,
                )

                return Number(secondStartsWith) - Number(firstStartsWith)
            })
            .slice(0, 6)
    }, [sites, normalizedQuery])

    const places = isDebouncing ? [] : loadedPlaces
    const hasPlaceSearchError = !isDebouncing && isPlacesError

    const handleSiteSelect = (site: SevesoSite) => {
        onSiteSelect(site)
        onQueryChange('')
        setIsMobileSearchOpen(false)
    }

    const handlePlaceSelect = (place: PlaceSearchResult) => {
        onPlaceSelect(place)
        onQueryChange('')
        setIsMobileSearchOpen(false)
    }

    const handleClearSearch = () => {
        onQueryChange('')
    }

    const resultsProps: SearchResultsProps = {
        id: '',
        query,
        sites: matchingSites,
        places,
        isSitesLoading,
        isPlacesLoading,
        isPlacesDebouncing: isDebouncing,
        isPlacesError: hasPlaceSearchError,
        onSiteSelect: handleSiteSelect,
        onPlaceSelect: handlePlaceSelect,
    }

    return (
        <>
            <div className="relative hidden w-72 md:block lg:w-80">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
                    <Search size={17} className="shrink-0 text-slate-400" />

                    <input
                        type="text"
                        value={query}
                        onChange={(event) => onQueryChange(event.target.value)}
                        onFocus={() => setIsDesktopFocused(true)}
                        onBlur={() => setIsDesktopFocused(false)}
                        placeholder="Szukaj zakładu lub miejscowości..."
                        autoComplete="off"
                        aria-label="Szukaj zakładu lub miejscowości"
                        aria-controls={`${searchId}-desktop`}
                        aria-expanded={isDesktopFocused && query.trim().length >= 2}
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            aria-label="Wyczyść wyszukiwanie"
                            className="shrink-0 text-slate-400 hover:text-slate-700"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {isDesktopFocused && query.trim().length >= 2 && (
                    <SearchResults
                        {...resultsProps}
                        id={`${searchId}-desktop`}
                    />
                )}
            </div>

            <button
                type="button"
                onClick={() => setIsMobileSearchOpen(true)}
                aria-label="Otwórz wyszukiwarkę"
                aria-expanded={isMobileSearchOpen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 md:hidden"
            >
                <Search size={21} />
            </button>

            {isMobileSearchOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Zamknij wyszukiwarkę"
                        onClick={() => setIsMobileSearchOpen(false)}
                        className="fixed inset-0 z-40 bg-slate-950/30 md:hidden"
                    />

                    <div className="fixed left-3 right-3 top-[4.5rem] z-50 md:hidden">
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-lg focus-within:border-emerald-500">
                            <button
                                type="button"
                                onClick={() => setIsMobileSearchOpen(false)}
                                aria-label="Zamknij wyszukiwarkę"
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                            >
                                <ArrowLeft size={19} />
                            </button>

                            <Search size={19} className="shrink-0 text-slate-400" />

                            <input
                                type="text"
                                autoFocus
                                value={query}
                                onChange={(event) => onQueryChange(event.target.value)}
                                placeholder="Szukaj zakładu lub miejscowości..."
                                autoComplete="off"
                                aria-label="Szukaj zakładu lub miejscowości"
                                aria-controls={`${searchId}-mobile`}
                                aria-expanded={query.trim().length >= 2}
                                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                            />

                            {query && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    aria-label="Wyczyść wyszukiwanie"
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                                >
                                    <X size={19} />
                                </button>
                            )}
                        </div>

                        <SearchResults
                            {...resultsProps}
                            id={`${searchId}-mobile`}
                        />
                    </div>
                </>
            )}
        </>
    )
}
