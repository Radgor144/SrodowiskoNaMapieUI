
import {
    parsePlaceFeature,
    type PlaceSearchResult,
} from '../model/place'

const PHOTON_API_URL = 'https://photon.komoot.io/api/'

const MAX_PLACE_RESULTS = 6

type JsonRecord = Record<string, unknown>

function isJsonRecord(value: unknown): value is JsonRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export async function searchPlaces(
    query: string,
    signal?: AbortSignal,
): Promise<PlaceSearchResult[]> {
    const url = new URL(PHOTON_API_URL)

    url.searchParams.set('q', query)
    url.searchParams.set('lang', 'default')
    url.searchParams.set('countrycode', 'PL')
    url.searchParams.set('limit', String(MAX_PLACE_RESULTS))
    url.searchParams.append('layer', 'city')
    url.searchParams.append('layer', 'locality')

    const response = await fetch(url, { signal })

    if (!response.ok) {
        throw new Error(`Place search failed: HTTP ${response.status}`)
    }

    const payload: unknown = await response.json()

    if (!isJsonRecord(payload) || !Array.isArray(payload.features)) {
        throw new Error('Invalid Photon response')
    }

    return payload.features
        .map(parsePlaceFeature)
        .filter((place): place is PlaceSearchResult => place !== null)
}
