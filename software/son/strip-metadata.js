import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import exifReader from 'exif-reader'

const SUPPORTED_EXT = ['.jpg', '.jpeg', '.tiff']

async function stripImageMetadata(filePath) {
	try {
		const image = sharp(filePath)
		const metadata = await image.metadata()

		// Check if EXIF exists and contains useful info
		let hasSensitiveExif = false

		if (metadata.exif) {
			try {
				const exif = exifReader(metadata.exif)
				const gps = exif?.gps
				const imageTags = exif?.image

				if (gps && Object.keys(gps).length > 0) {
					hasSensitiveExif = true
				}

				const privateTags = [
					'Artist',
					'Software',
					'XPComment',
					'XPKeywords',
					'XPSubject',
					'XPTitle'
				]
				if (imageTags) {
					for (const tag of privateTags) {
						if (imageTags[tag]) {
							hasSensitiveExif = true
							break
						}
					}
				}

				if (!hasSensitiveExif) {
					console.log(`[SKIP] No sensitive EXIF: ${filePath}`)
					return
				}
			} catch (decodeErr) {
				console.warn(`[WARN] Could not decode EXIF, processing anyway: ${filePath}`)
				hasSensitiveExif = true // fallback to processing
			}
		} else {
			console.log(`[SKIP] No EXIF at all: ${filePath}`)
			return
		}

		const output = await image
			.withMetadata({ exif: undefined }) // Strip all EXIF
			.toBuffer()

		await fs.promises.writeFile(filePath, output)
		console.log(`[CLEANED] ${filePath}`)
	} catch (err) {
		console.error(`[ERROR] ${filePath}`, err.message)
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

// Set your target directory
const targetDir = './public'

walk(targetDir).then(() => walk('./src'))
