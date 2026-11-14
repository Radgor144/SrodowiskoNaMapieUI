export type SevesoSiteType = 'ZZR' | 'ZDR'

export type SevesoSite = {
    sourceId: number
    name: string
    siteType: SevesoSiteType
    status: string | null
    activityCode: string | null
    activityClassificationUrl: string | null
    gmlIdentifier: string | null
    longitude: number
    latitude: number
}

type JsonRecord = Record<string, unknown>

function isJsonRecord(value: unknown): value is JsonRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSevesoSiteType(value: unknown): value is SevesoSiteType {
    return value === 'ZZR' || value === 'ZDR'
}

function getNullableString(value: unknown): string | null {
    return typeof value === 'string' ? value : null
}

export function parseSevesoSiteFeature(feature: unknown): SevesoSite | null {
    if (!isJsonRecord(feature)) {
        return null
    }

    const properties = feature.properties
    const geometry = feature.geometry

    if (!isJsonRecord(properties) || !isJsonRecord(geometry)) {
        return null
    }

    const coordinates = geometry.coordinates
    const sourceId = properties.ifcid
    const name = properties.name
    const siteType = properties.sevesotype

    if (
        geometry.type !== 'Point' ||
        !Array.isArray(coordinates) ||
        coordinates.length < 2 ||
        typeof coordinates[0] !== 'number' ||
        !Number.isFinite(coordinates[0]) ||
        typeof coordinates[1] !== 'number' ||
        !Number.isFinite(coordinates[1]) ||
        typeof sourceId !== 'number' ||
        !Number.isInteger(sourceId) ||
        typeof name !== 'string' ||
        !isSevesoSiteType(siteType)
    ) {
        return null
    }

    return {
        sourceId,
        name,
        siteType,
        status: getNullableString(properties.status),
        activityCode: getNullableString(properties.tech_activity),
        activityClassificationUrl: getNullableString(properties.activity_cl),
        gmlIdentifier: getNullableString(properties.gmlidentifier),
        longitude: coordinates[0],
        latitude: coordinates[1],
    }
}
