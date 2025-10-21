import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

import {
    AlertsResponse,
    ForecastPeriod,
    ForecastResponse,
    PointsResponse
} from './types'
import { formatAlert, makeNWSRequest, NWS_API_BASE } from './utils'

import { z as mcpZod } from 'mcp-zod'
const z = mcpZod as unknown as typeof import('zod/v3')

const server = new McpServer({
    name: 'weather',
    version: '1.0.0'
})

// Register weather tools
server.registerTool(
    'get_alerts',
    {
        title: 'Get active weather alerts for a specific state',
        description:
            'Get active weather alerts for a specific state using its two-letter code',
        inputSchema: {
            state: z
                .string()
                .length(2)
                .describe('Two-letter state code (e.g. CA, NY)')
        }
    },
    async ({ state }, _) => {
        const stateCode = state.toUpperCase()
        const alertsData = await makeNWSRequest<AlertsResponse>(
            `${NWS_API_BASE}/alerts?area=${stateCode}`
        )

        if (!alertsData) {
            return {
                content: [
                    {
                        type: 'text',
                        text: 'Failed to retrieve alerts data'
                    }
                ]
            }
        }

        const features = alertsData.features || []
        if (features.length === 0) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `No active alerts for ${stateCode}`
                    }
                ]
            }
        }

        const formattedAlerts = features.map(formatAlert)
        const alertsText = `Active alerts for ${stateCode}:\n\n${formattedAlerts.join('\n')}`

        return {
            content: [
                {
                    type: 'text',
                    text: alertsText
                }
            ]
        }
    }
)

server.registerTool(
    'get_forecast',
    {
        title: 'Get weather forecast for a location',
        description:
            'Get the weather forecast for a specific location using latitude and longitude',
        inputSchema: {
            latitude: z
                .number()
                .min(-90)
                .max(90)
                .describe('Latitude of the location'),
            longitude: z
                .number()
                .min(-180)
                .max(180)
                .describe('Longitude of the location')
        }
    },
    async ({ latitude, longitude }, _) => {
        // Get grid point data
        const pointsUrl = `${NWS_API_BASE}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`
        const pointsData = await makeNWSRequest<PointsResponse>(pointsUrl)

        if (!pointsData) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Failed to retrieve grid point data for coordinates: ${latitude}, ${longitude}. This location may not be supported by the NWS API (only US locations are supported).`
                    }
                ]
            }
        }

        const forecastUrl = pointsData.properties?.forecast
        if (!forecastUrl) {
            return {
                content: [
                    {
                        type: 'text',
                        text: 'Failed to get forecast URL from grid point data'
                    }
                ]
            }
        }

        // Get forecast data
        const forecastData = await makeNWSRequest<ForecastResponse>(forecastUrl)
        if (!forecastData) {
            return {
                content: [
                    {
                        type: 'text',
                        text: 'Failed to retrieve forecast data'
                    }
                ]
            }
        }

        const periods = forecastData.properties?.periods || []
        if (periods.length === 0) {
            return {
                content: [
                    {
                        type: 'text',
                        text: 'No forecast periods available'
                    }
                ]
            }
        }

        // Format forecast periods
        const formattedForecast = periods.map((period: ForecastPeriod) =>
            [
                `${period.name || 'Unknown'}:`,
                `Temperature: ${period.temperature || 'Unknown'}°${period.temperatureUnit || 'F'}`,
                `Wind: ${period.windSpeed || 'Unknown'} ${period.windDirection || ''}`,
                `${period.shortForecast || 'No forecast available'}`,
                '---'
            ].join('\n')
        )

        const forecastText = `Forecast for ${latitude}, ${longitude}:\n\n${formattedForecast.join('\n')}`

        return {
            content: [
                {
                    type: 'text',
                    text: forecastText
                }
            ]
        }
    }
)

server.registerTool(
    'get_china_weather',
    {
        title: 'Get weather forecast for a location in China',
        description: 'Get weather forecast for a location in China',
        inputSchema: {
            latitude: z
                .number()
                .min(-90)
                .max(90)
                .describe('Latitude of the location'),
            longitude: z
                .number()
                .min(-180)
                .max(180)
                .describe('Longitude of the location')
        }
    },
    async ({ latitude, longitude }) => {
        return {
            content: [
                {
                    type: 'text',
                    text: `China weather is not supported yet, ${latitude}, ${longitude}`
                }
            ]
        }
    }
)

// Start the server
async function main() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    console.error('Weather MCP Server running on stdio')
}

main().catch(error => {
    console.error('Fatal error in main():', error)
    process.exit(1)
})
