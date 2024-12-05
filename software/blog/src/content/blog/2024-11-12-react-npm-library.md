---
title: New React npm Library
pubDate: "2024-11-12"
tags: []
---

# Background
Being late 2024 I've seen a few [articles](https://andrewwalpole.com/blog/use-vite-for-javascript-libraries/) on creating a new React npm library.

I went with [one](https://dev.to/receter/how-to-create-a-react-component-library-using-vites-library-mode-4lma), and it went well, although some of the "customizations" seemed unnecessary, so I went with more of a pure Vite approach.

Turned out great.


# Considerations

At work, we have multiple teams with their own separate UI/React codebases. 

With that in mind, we can leverage peer dependencies. We expect the teams to have libraries like MUI or date-fns installed. We don't want to bundle these libraries in the package.

Adding Storybook was imperative so we could develop and test things extensively without importing into apps and testing manually.

# Learnings

Vite is awesome 👑

Exclude stories from generated package by editing `tsconfig.json`:
```
"exclude": ["dist", "**/*.stories.tsx"]
```

I use Webstorm and I wasn't seeing red squigglies for a while, it turned out I just needed to open the errors panel. 🤷

To ignore those 3rd party libraries from being bundled edit your `vite.config`:
```
export default defineConfig({
    build: {
        rollupOptions: {
            external: [/^@mui\//]
        }
    }
})
```
(Notice how you can use a regex to target **all** MUI packages)

To see what your bundling and how large it is, use: `rollup-plugin-visualizer`

To get types, use: `vite-plugin-dts`

_(...more to come...)_