import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const SUPPORTED_EXT = ['.jpg', '.jpeg', '.tiff']

async function stripImageMetadata(filePath) {
	try {
		const output = await sharp(filePath)
			.withMetadata({ exif: undefined }) // Strip EXIF
			.toBuffer()
		await fs.promises.writeFile(filePath, output)
		console.log(`[Cleaned] ${filePath}`)
	} catch (err) {
		console.error(`[Error] ${filePath}`, err)
	}
}

async function walk(dir) {
	const entries = await fs.promises.readdir(dir, { withFileTypes: true })
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			await walk(fullPath)
		} else if (SUPPORTED_EXT.includes(path.extname(entry.name).toLowerCase())) {
			await stripImageMetadata(fullPath)
		}
	}
}

// Replace this with your image directory
const targetDir = './src'

walk(targetDir)
