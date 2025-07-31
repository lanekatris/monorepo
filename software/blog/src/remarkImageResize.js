import { visit } from 'unist-util-visit'
import path from 'path'
import fs from 'fs-extra'
import sharp from 'sharp'
import crypto from 'crypto'

const OUTPUT_DIR = './public/_images'
const ORIGINAL_DIR = path.join(OUTPUT_DIR, 'full')

function hashFileWithWidth(filePath, width) {
	const fileBuffer = fs.readFileSync(filePath)
	const hash = crypto.createHash('sha1')
	hash.update(fileBuffer)
	hash.update(width.toString())
	return hash.digest('hex').slice(0, 12)
}

export default function remarkImageResizeFigure() {
	return async function transformer(tree) {
		const tasks = []

		visit(tree, 'image', (node, index, parent) => {
			const [rawPath, widthStr] = node.url.split('|')
			const width = parseInt(widthStr, 10)
			if (!width || isNaN(width)) return

			const absSourcePath = path.resolve('./src/assets', rawPath)
			if (!fs.existsSync(absSourcePath)) return

			const ext = path.extname(rawPath)
			const base = path.basename(rawPath, ext)
			const hash = hashFileWithWidth(absSourcePath, width)
			const resizedName = `${base}-${width}-${hash}${ext}`
			const originalName = `${base}-full-${hash}${ext}`
			const resizedPath = path.join(OUTPUT_DIR, resizedName)
			const originalPath = path.join(ORIGINAL_DIR, originalName)

			const publicResizedUrl = `/_images/${resizedName}`
			const publicOriginalUrl = `/_images/full/${originalName}`

			const resizePromise = fs
				.ensureDir(ORIGINAL_DIR)
				.then(() =>
					Promise.all([
						// Copy original
						fs.copyFile(absSourcePath, originalPath),
						// Generate resized
						sharp(absSourcePath).resize({ width }).toFile(resizedPath)
					])
				)
				.then(() => {
					const html = `
<figure>
  <a href="${publicOriginalUrl}" target="_blank" rel="noopener">
    <img src="${publicResizedUrl}" width="${width}" alt="${node.alt}">
  </a>
  ${node.alt ? `<figcaption>${node.alt}</figcaption>` : ''}
</figure>`.trim()

					parent.children[index] = {
						type: 'html',
						value: html
					}
				})

			tasks.push(resizePromise)
		})

		if (tasks.length) await Promise.all(tasks)
	}
}
