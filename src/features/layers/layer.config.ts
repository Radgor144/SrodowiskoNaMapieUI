import {
    Building2,
    ShieldAlert,
    Volume2,
    Waves,
    Wind,
    type LucideIcon,
} from 'lucide-react'

export const LAYER_CATEGORIES = [
    {
        id: 'industry',
        label: 'Przemysł',
    },
    {
        id: 'environment',
        label: 'Środowisko',
    },
] as const

type LayerCategory = (typeof LAYER_CATEGORIES)[number]['id']

type LayerDefinition = {
    id: string
    category: LayerCategory
    label: string
    description: string
    icon: LucideIcon
}

export const LAYERS = [
    {
        id: 'seveso',
        category: 'industry',
        label: 'Zakłady SEVESO',
        description: 'ZZR i ZDR',
        icon: ShieldAlert,
    },
    {
        id: 'prtr',
        category: 'industry',
        label: 'Emisje przemysłowe',
        description: 'Dane PRTR',
        icon: Building2,
    },
    {
        id: 'air',
        category: 'environment',
        label: 'Jakość powietrza',
        description: 'Stacje pomiarowe',
        icon: Wind,
    },
    {
        id: 'noise',
        category: 'environment',
        label: 'Hałas',
        description: 'Mapy akustyczne',
        icon: Volume2,
    },
    {
        id: 'water',
        category: 'environment',
        label: 'Wody powierzchniowe',
        description: 'Stan i jakość wód',
        icon: Waves,
    },
] as const satisfies readonly LayerDefinition[]

export type LayerId = (typeof LAYERS)[number]['id']

export const DEFAULT_ACTIVE_LAYER_IDS = [
    'seveso',
] as const satisfies readonly LayerId[]