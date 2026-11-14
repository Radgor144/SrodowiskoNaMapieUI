
export type PlaceExtent = readonly [
    west: number,
    south: number,
    east: number,
    north: number,
]

export type PlaceSearchResult = {
    id: string
    name: string
    context: string
    placeTypeLabel: string
    longitude: number
    latitude: number
    extent: PlaceExtent | null
}

type JsonRecord = Record<string, unknown>

const PLACE_TYPE_LABELS: Record<string, string> = {
    city: 'Miasto',
    town: 'Miasto',
    village: 'Wieś',
    hamlet: 'Osada',
    suburb: 'Dzielnica',
    neighbourhood: 'Okolica',
    locality: 'Miejscowość',
}

function isJsonRecord(value: unknown): value is JsonRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getString(value: unknown): string | null {
    if (typeof value !== 'string' || value.trim().length === 0) {
        return null
    }

    return value.trim()
}

function getPlaceExtent(value: unknown): PlaceExtent | null {
    if (
        !Array.isArray(value) ||
        value.length !== 4 ||
        !value.every(
            (coordinate): coordinate is number =>
                typeof coordinate === 'number' && Number.isFinite(coordinate),
        )
    ) {
        return null
    }

    const [west, south, east, north] = value

    if (west > east || south > north) {
        return null
    }

    return [west, south, east, north]
}

function getPlaceContext(properties: JsonRecord, name: string): string {
    const contextParts = [
        properties.district,
        properties.city,
        properties.county,
        properties.state,
        properties.country,
    ]
        .map(getString)
        .filter((value): value is string => value !== null)
        .filter((value, index, values) =>
            value !== name && values.indexOf(value) === index,
        )

    return contextParts.join(', ')
}

export function parsePlaceFeature(feature: unknown): PlaceSearchResult | null {
    if (!isJsonRecord(feature)) {
        return null
    }

    const properties = feature.properties
    const geometry = feature.geometry

    if (!isJsonRecord(properties) || !isJsonRecord(geometry)) {
        return null
    }

    const coordinates = geometry.coordinates
    const name = getString(properties.name)
    const countryCode = getString(properties.countrycode)?.toUpperCase()

    if (
        geometry.type !== 'Point' ||
        !Array.isArray(coordinates) ||
        coordinates.length < 2 ||
        typeof coordinates[0] !== 'number' ||
        !Number.isFinite(coordinates[0]) ||
        typeof coordinates[1] !== 'number' ||
        !Number.isFinite(coordinates[1]) ||
        !name ||
        (countryCode !== null && countryCode !== undefined && countryCode !== 'PL')
    ) {
        return null
    }

    const osmType = getString(properties.osm_type)
    const osmId = properties.osm_id

    const id =
        osmType && (typeof osmId === 'number' || typeof osmId === 'string')
            ? `${osmType}-${osmId}`
            : `${name}-${coordinates[0]}-${coordinates[1]}`

    const osmValue = getString(properties.osm_value)

    return {
        id,
        name,
        context: getPlaceContext(properties, name),
        placeTypeLabel:
            (osmValue && PLACE_TYPE_LABELS[osmValue]) ?? 'Miejscowość',
        longitude: coordinates[0],
        latitude: coordinates[1],
        extent: getPlaceExtent(properties.extent),
    }
}
