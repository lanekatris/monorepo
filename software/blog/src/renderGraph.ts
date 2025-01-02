import type { ChartConfiguration } from 'chart.js'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'

export function renderGraph(height: number, width: number, config: ChartConfiguration) {
	const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, type: 'svg' })
	const buffer = chartJSNodeCanvas.renderToBufferSync(config, 'image/svg+xml')
	return buffer
}
