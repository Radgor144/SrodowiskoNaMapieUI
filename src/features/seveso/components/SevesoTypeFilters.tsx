import type { SevesoSiteType } from '../model/sevesoSite'

type SevesoTypeFiltersProps = {
    enabledSiteTypes: readonly SevesoSiteType[]
    onSiteTypeToggle: (siteType: SevesoSiteType) => void
}

const SEVESO_TYPE_OPTIONS = [
    {
        siteType: 'ZDR',
        label: 'Zakłady dużego ryzyka',
        colorClassName: 'bg-red-600',
    },
    {
        siteType: 'ZZR',
        label: 'Zakłady zwiększonego ryzyka',
        colorClassName: 'bg-amber-500',
    },
] as const satisfies ReadonlyArray<{
    siteType: SevesoSiteType
    label: string
    colorClassName: string
}>

export function SevesoTypeFilters({
                                      enabledSiteTypes,
                                      onSiteTypeToggle,
                                  }: SevesoTypeFiltersProps) {
    return (
        <fieldset className="ml-9 mt-2 space-y-2 border-l border-slate-200 pl-3">
            <legend className="sr-only">Filtruj według rodzaju zakładu</legend>

            {SEVESO_TYPE_OPTIONS.map((option) => (
                <label
                    key={option.siteType}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 transition hover:bg-slate-50"
                >
                    <input
                        type="checkbox"
                        checked={enabledSiteTypes.includes(option.siteType)}
                        onChange={() => onSiteTypeToggle(option.siteType)}
                        className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                    />

                    <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${option.colorClassName}`}
                    />

                    <span className="text-xs text-slate-600">
            {option.label}
          </span>
                </label>
            ))}
        </fieldset>
    )
}
