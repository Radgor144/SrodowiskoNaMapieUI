import { Info, MapPin } from 'lucide-react'

export function ObjectDetailsPanel() {
    return (
        <aside className="hidden w-80 shrink-0 flex-col border-l border-slate-200 bg-white lg:flex">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
                <h2 className="text-sm font-semibold">
                    Szczegóły obiektu
                </h2>

                <Info size={18} className="text-slate-400" />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    <MapPin size={26} className="text-slate-400" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-700">
                    Nie wybrano obiektu
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Kliknij dowolny obiekt na mapie, aby zobaczyć jego szczegóły.
                </p>
            </div>

            <div className="border-t border-slate-200 p-4">
                <p className="text-xs text-slate-400">
                    Dane pochodzą z publicznych rejestrów środowiskowych.
                </p>
            </div>
        </aside>
    )
}