import type { ChartConfiguration } from 'chart.js'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { parse, parseSync, stringify } from 'svgson'
import { v4 as uuid } from 'uuid'

export function renderGraph(height: number, width: number, config: ChartConfiguration) {
	const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, type: 'svg' })
	const buffer = chartJSNodeCanvas.renderToBufferSync(config, 'image/svg+xml')

	// chartjs-node-canvas creates elements with IDs that can conflict if you render more than one SVG
	// on a page. This alters the IDs to prevent conflicts so everything renders as expected
	const svgNode = parseSync(buffer.toString('utf8'))
	svgNode.children[0].children.forEach((child) => {
		child.attributes.id = uuid()
	})
	return Buffer.from(stringify(svgNode), 'utf-8')
}
