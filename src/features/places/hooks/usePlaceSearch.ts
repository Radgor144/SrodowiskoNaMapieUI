
import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { searchPlaces } from '../api/placeSearchApi'

export const PLACE_SEARCH_QUERY_KEY = ['places', 'search'] as const

const MIN_QUERY_LENGTH = 3
const DEBOUNCE_DELAY_MS = 700

export function usePlaceSearch(query: string) {
    const normalizedQuery = query.trim()

    const debouncedQuery = useDebouncedValue(
        normalizedQuery,
        DEBOUNCE_DELAY_MS,
    )

    const queryResult = useQuery({
        queryKey: [...PLACE_SEARCH_QUERY_KEY, debouncedQuery],
        queryFn: ({ signal }) => searchPlaces(debouncedQuery, signal),
        enabled: debouncedQuery.length >= MIN_QUERY_LENGTH,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
    })

    return {
        ...queryResult,
        isDebouncing:
            normalizedQuery.length >= MIN_QUERY_LENGTH &&
            normalizedQuery !== debouncedQuery,
    }
}
