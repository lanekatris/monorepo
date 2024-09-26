import { defineConfig,defineSchema , s } from 'velite';
import rehypeShiki from '@shikijs/rehype';
import { exec } from 'child_process'
import { promisify } from 'util'
import { stat } from 'fs/promises'
const execAsync = promisify(exec)

interface GitInfo {
  sha: string
  short: string
  date:string
}

// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.
// const timestamp = defineSchema(() =>
//     s
//       .custom<string | undefined>(i => i === undefined || typeof i === 'string')
//       .transform<GitInfo>(async (value, { meta, addIssue }) => {
//       if (value != null) {
//         addIssue({ fatal: false, code: 'custom', message: '`s.timestamp()` schema will resolve the value from `git log -1 --format=%cd`' })
//       }
//         const { stdout :date} = await execAsync(`git log -1 --format=%cd ${meta.path}`)
//         const { stdout :sha} = await execAsync(`git log -1 --format=%H ${meta.path}`)
//         const { stdout :short} = await execAsync(`git log -1 --format=%h ${meta.path}`)
//
//         // return new Date(date).toISOString()
//         return {
//         sha: sha.replace('\n', ''),
//           short:short.replace('\n', ''),
//           date: new Date(date).toISOString()
//         }
//     })
// )

const timestamp = defineSchema(() =>
  s
    .custom<string | undefined>(i => i === undefined || typeof i === 'string')
    .transform<string>(async (value, { meta, addIssue }) => {
      if (value != null) {
        addIssue({ fatal: false, code: 'custom', message: '`s.timestamp()` schema will resolve the file modified timestamp' })
      }

      const stats = await stat(meta.path)
      return stats.mtime.toISOString()
    })
)
export default defineConfig({
  root: 'content',
  collections: {
    posts: {
      name: 'Post', // collection type name
      pattern: 'posts/**/*.md', // content files glob pattern
      schema: s
        .object({
          title: s.string().max(99), // Zod primitive type
          slug: s.slug('posts'), // validate format, unique in posts collection
          // slug: s.path(), // auto generate slug from file path
          date: s.isodate(), // input Date-like string, output ISO Date string.
          cover: s.image().optional(), // input image relative path, output image object with blurImage.
          video: s.file().optional(), // input file relative path, output file public path.
          metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
          excerpt: s.excerpt(), // excerpt of markdown content
          content: s.markdown(), // transform markdown to html
          tags: s.string().array().optional(),
          draft: s.boolean().optional(),
          lastModified: timestamp()
        })
        // more additional fields (computed fields)
        .transform((data) => ({ ...data, permalink: `/blog/${data.slug}` }))
    }
  },
  markdown: {
    rehypePlugins: [[rehypeShiki, { theme: 'nord' }]]
  }
});
