
import { useEffect, useState } from 'react'
import {
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Info,
    MapPin,
    X,
} from 'lucide-react'
import type { SevesoSite } from '../../seveso/model/sevesoSite'

type ObjectDetailsPanelProps = {
    site: SevesoSite | null
    onClose: () => void
}

type SiteDetailsProps = {
    site: SevesoSite
    showIdentity?: boolean
}

function SiteDetails({
                         site,
                         showIdentity = true,
                     }: SiteDetailsProps) {
    return (
        <div className="space-y-6 p-5">
            {showIdentity && (
                <section>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Zakład SEVESO
          </span>

                    <h3 className="mt-2 text-base font-semibold leading-relaxed text-slate-900">
                        {site.name}
                    </h3>

                    <span
                        className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            site.siteType === 'ZDR'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-amber-50 text-amber-700'
                        }`}
                    >
            {site.siteType}
          </span>
                </section>
            )}

            <section>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Informacje
                </h4>

                <dl className="space-y-4">
                    <div>
                        <dt className="text-xs text-slate-500">Status</dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                            {site.status ?? 'Brak danych'}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-xs text-slate-500">
                            Kod działalności (NACE)
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                            {site.activityCode ?? 'Brak danych'}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-xs text-slate-500">
                            Identyfikator GIOŚ
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                            {site.sourceId}
                        </dd>
                    </div>
                </dl>
            </section>

            <section>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Lokalizacja
                </h4>

                <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin size={17} className="mt-0.5 shrink-0 text-slate-400" />

                    <span>
            {site.latitude.toFixed(5)}, {site.longitude.toFixed(5)}
          </span>
                </div>
            </section>

            {site.gmlIdentifier && (
                <a
                    href={site.gmlIdentifier}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                    Identyfikator INSPIRE
                    <ExternalLink size={15} />
                </a>
            )}
        </div>
    )
}

function EmptyDetails() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <MapPin size={26} className="text-slate-400" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-700">
                Nie wybrano obiektu
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Kliknij dowolny zakład na mapie, aby zobaczyć jego szczegóły.
            </p>
        </div>
    )
}

export function ObjectDetailsPanel({
                                       site,
                                       onClose,
                                   }: ObjectDetailsPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        setIsExpanded(false)
    }, [site?.sourceId])

    const handleClose = () => {
        setIsExpanded(false)
        onClose()
    }

    return (
        <>
            <aside className="hidden w-80 shrink-0 flex-col border-l border-slate-200 bg-white lg:flex">
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
                    <h2 className="text-sm font-semibold">Szczegóły obiektu</h2>
                    <Info size={18} className="text-slate-400" />
                </div>

                {site ? (
                    <div className="flex-1 overflow-y-auto">
                        <SiteDetails site={site} />
                    </div>
                ) : (
                    <EmptyDetails />
                )}

                <div className="shrink-0 border-t border-slate-200 p-4">
                    <p className="text-xs text-slate-400">
                        Źródło danych: GIOŚ
                    </p>
                </div>
            </aside>

            {site && (
                <aside
                    aria-label="Szczegóły wybranego obiektu"
                    className={`fixed inset-x-0 bottom-0 z-30 flex flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl transition-[height] duration-200 ease-out lg:hidden ${
                        isExpanded ? 'h-[70dvh]' : 'h-[132px]'
                    }`}
                >
                    <div className="flex shrink-0 flex-col border-b border-slate-200">
                        <div className="flex justify-center py-2">
                            <div className="h-1 w-10 rounded-full bg-slate-300" />
                        </div>

                        <div className="flex items-center justify-between gap-3 px-5 pb-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-slate-400">
                                    Zakład SEVESO
                                </p>

                                <h3 className="mt-1 truncate text-sm font-semibold text-slate-900">
                                    {site.name}
                                </h3>

                                <span
                                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                        site.siteType === 'ZDR'
                                            ? 'bg-red-50 text-red-700'
                                            : 'bg-amber-50 text-amber-700'
                                    }`}
                                >
                  {site.siteType}
                </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded((current) => !current)}
                                    aria-label={
                                        isExpanded
                                            ? 'Zwiń szczegóły'
                                            : 'Rozwiń szczegóły'
                                    }
                                    aria-expanded={isExpanded}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                                >
                                    {isExpanded ? (
                                        <ChevronDown size={21} />
                                    ) : (
                                        <ChevronUp size={21} />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    aria-label="Zamknij szczegóły"
                                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <SiteDetails site={site} showIdentity={false} />

                            <div className="border-t border-slate-200 p-4">
                                <p className="text-xs text-slate-400">
                                    Źródło danych: GIOŚ
                                </p>
                            </div>
                        </div>
                    )}
                </aside>
            )}
        </>
    )
}
