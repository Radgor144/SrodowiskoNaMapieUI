import type { ReactNode } from 'react'

type LayerItemProps = {
    icon: ReactNode
    label: string
    description: string
    active: boolean
    onToggle: () => void
}

export function LayerItem({
                              icon,
                              label,
                              description,
                              active,
                              onToggle,
                          }: LayerItemProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-pressed={active}
            className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                active
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-50'
            }`}
        >
      <span className={active ? 'text-emerald-700' : 'text-slate-400'}>
        {icon}
      </span>

            <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>
        <span className="mt-0.5 block text-xs text-slate-500">
          {description}
        </span>
      </span>

            <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    active ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
            />
        </button>
    )
}