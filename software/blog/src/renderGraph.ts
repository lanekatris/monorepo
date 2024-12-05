import type { ChartConfiguration } from 'chart.js'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'

export async function renderGraph(height: number, width: number, config: ChartConfiguration) {
	const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height })
	return chartJSNodeCanvas.renderToDataURL(config)
}
