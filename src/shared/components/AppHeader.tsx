import { Bell, Search } from 'lucide-react'

type AppHeaderProps = {
    searchQuery: string
    onSearchChange: (value: string) => void
}

export function AppHeader({
                              searchQuery,
                              onSearchChange,
                          }: AppHeaderProps) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
            <div>
                <h2 className="text-sm font-semibold">
                    Mapa środowiskowa Polski
                </h2>
                <p className="text-xs text-slate-500">
                    Dane środowiskowe w jednym miejscu
                </p>
            </div>

            <div className="flex items-center gap-5">
                <div className="flex w-72 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                    <Search size={17} className="text-slate-400" />

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Szukaj lokalizacji..."
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />
                </div>

                <button
                    type="button"
                    aria-label="Powiadomienia"
                    className="text-slate-500 transition hover:text-slate-900"
                >
                    <Bell size={20} />
                </button>
            </div>
        </header>
    )
}