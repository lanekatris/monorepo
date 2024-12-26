// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightObsidian, { obsidianSidebarGroup } from "starlight-obsidian";
import starlightBlog from "starlight-blog";
import starlightImageZoom from "starlight-image-zoom";
import starlightLinksValidator from "starlight-links-validator";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightLinksValidator(),
        starlightImageZoom(),
        // starlightBlog(),
        starlightObsidian({
          vault: "/home/lane/Documents/lkat-vault",
          ignore: [
            "_admin/**",
            "10 Life Admin/**",
            "20 Work/**",
            "30 Journal/**",
            "Feed/**",
            "Notes/**",
            "40 Apps/**",
            "Adventures/**",
            "*.*",
            "Bad Adventures",
            "Projects",
            "Logs",
            "Trip Ideas and Plans",
            "OldPublic",
          ],
        }),
      ],
      title: "My Docs",
      social: {
        github: "https://github.com/withastro/starlight",
      },
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
        obsidianSidebarGroup,
      ],
    }),
  ],
});
