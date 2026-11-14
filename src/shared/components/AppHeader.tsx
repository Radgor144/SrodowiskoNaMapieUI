
import { Bell, Menu, Search } from 'lucide-react'

type AppHeaderProps = {
    searchQuery: string
    onSearchChange: (value: string) => void
    onMenuClick: () => void
}

export function AppHeader({
                              searchQuery,
                              onSearchChange,
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

            <div className="flex shrink-0 items-center gap-3 sm:gap-5">
                <div className="hidden w-56 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 md:flex lg:w-72">
                    <Search size={17} className="shrink-0 text-slate-400" />

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
