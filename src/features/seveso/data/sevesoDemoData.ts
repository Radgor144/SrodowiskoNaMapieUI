import type { SevesoGeoJsonFeatureCollection } from '../model/sevesoSite'

export const SEVESO_DEMO_DATA = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            id: 'demo-1',
            geometry: {
                type: 'Point',
                coordinates: [21.0122, 52.2297],
            },
            properties: {
                siteId: 'demo-1',
                name: 'Przykładowy zakład 1',
                siteType: 'ZDR',
                isDemo: true,
            },
        },
        {
            type: 'Feature',
            id: 'demo-2',
            geometry: {
                type: 'Point',
                coordinates: [19.0238, 50.2649],
            },
            properties: {
                siteId: 'demo-2',
                name: 'Przykładowy zakład 2',
                siteType: 'ZZR',
                isDemo: true,
            },
        },
        {
            type: 'Feature',
            id: 'demo-3',
            geometry: {
                type: 'Point',
                coordinates: [18.6466, 54.352],
            },
            properties: {
                siteId: 'demo-3',
                name: 'Przykładowy zakład 3',
                siteType: 'ZDR',
                isDemo: true,
            },
        },
    ],
} satisfies SevesoGeoJsonFeatureCollection