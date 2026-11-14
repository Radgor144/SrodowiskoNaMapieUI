
import type { SevesoSite, SevesoSiteType } from '../../seveso/model/sevesoSite'

type SevesoMapFeatureProperties = {
    [key: string]: string | number
    sourceId: number
    name: string
    siteType: SevesoSiteType
}

type SevesoMapFeature = {
    type: 'Feature'
    id: number
    geometry: {
        type: 'Point'
        coordinates: [longitude: number, latitude: number]
    }
    properties: SevesoMapFeatureProperties
}

export type SevesoMapFeatureCollection = {
    type: 'FeatureCollection'
    features: SevesoMapFeature[]
}

export function toSevesoFeatureCollection(
    sites: readonly SevesoSite[],
): SevesoMapFeatureCollection {
    return {
        type: 'FeatureCollection',
        features: sites.map((site) => ({
            type: 'Feature',
            id: site.sourceId,
            geometry: {
                type: 'Point',
                coordinates: [site.longitude, site.latitude],
            },
            properties: {
                sourceId: site.sourceId,
                name: site.name,
                siteType: site.siteType,
            },
        })),
    }
}
