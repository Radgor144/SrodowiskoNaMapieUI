
import {
    parseSevesoSiteFeature,
    type SevesoSite,
} from '../model/sevesoSite'

const SEVESO_DATA_URL = `${import.meta.env.BASE_URL}data/seveso.geojson`

type JsonRecord = Record<string, unknown>

function isJsonRecord(value: unknown): value is JsonRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export async function getSevesoSites(
    signal?: AbortSignal,
): Promise<SevesoSite[]> {
    const response = await fetch(SEVESO_DATA_URL, { signal })

    if (!response.ok) {
        throw new Error(
            `Failed to fetch SEVESO sites: HTTP ${response.status}`,
        )
    }

    const payload: unknown = await response.json()

    if (
        !isJsonRecord(payload) ||
        payload.type !== 'FeatureCollection' ||
        !Array.isArray(payload.features)
    ) {
        throw new Error('Invalid SEVESO GeoJSON response')
    }

    if (payload.exceededTransferLimit === true) {
        throw new Error('SEVESO dataset exceeds the transfer limit')
    }

    const parsedSites = payload.features.map(parseSevesoSiteFeature)

    const invalidFeatureCount = parsedSites.filter(
        (site) => site === null,
    ).length

    if (invalidFeatureCount > 0) {
        throw new Error(
            `SEVESO dataset contains ${invalidFeatureCount} invalid features`,
        )
    }

    return parsedSites.filter(
        (site): site is SevesoSite => site !== null,
    )
}
