export type SevesoSiteType = 'ZZR' | 'ZDR'

export type SevesoSiteProperties = {
    siteId: string
    name: string
    siteType: SevesoSiteType
    isDemo: boolean
}

export type SevesoGeoJsonFeature = {
    type: 'Feature'
    id: string
    geometry: {
        type: 'Point'
        coordinates: [longitude: number, latitude: number]
    }
    properties: SevesoSiteProperties
}

export type SevesoGeoJsonFeatureCollection = {
    type: 'FeatureCollection'
    features: SevesoGeoJsonFeature[]
}