
import { useQuery } from '@tanstack/react-query'
import { getSevesoSites } from '../api/sevesoApi'

export const SEVESO_SITES_QUERY_KEY = ['seveso', 'sites'] as const

export function useSevesoSites() {
    return useQuery({
        queryKey: SEVESO_SITES_QUERY_KEY,
        queryFn: ({ signal }) => getSevesoSites(signal),
        staleTime: Infinity,
    })
}
