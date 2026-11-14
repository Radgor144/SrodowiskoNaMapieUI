import { ExternalLink, Info, MapPin } from 'lucide-react'
import type { SevesoSite } from '../../seveso/model/sevesoSite'

type ObjectDetailsPanelProps = {
    site: SevesoSite | null
}

function formatCoordinate(value: number): string {
    return value.toFixed(5)
}

export function ObjectDetailsPanel({ site }: ObjectDetailsPanelProps) {
    return (
        <aside className="hidden w-80 shrink-0 flex-col border-l border-slate-200 bg-white lg:flex">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
                <h2 className="text-sm font-semibold">Szczegóły obiektu</h2>
                <Info size={18} className="text-slate-400" />
            </div>

            {site ? (
                <div className="flex-1 space-y-6 overflow-y-auto p-5">
                    <div>
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
                    </div>

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
                {formatCoordinate(site.latitude)}, {formatCoordinate(site.longitude)}
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
            ) : (
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
            )}

            <div className="border-t border-slate-200 p-4">
                <p className="text-xs text-slate-400">
                    Źródło danych: GIOŚ
                </p>
            </div>
        </aside>
    )
}
