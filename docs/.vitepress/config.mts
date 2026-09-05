import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import taskLists from "markdown-it-task-lists";

export default withMermaid(
  defineConfig({
    lang: "en-US",
    title: "sshpod",
    description: "Dev Container orchestrator for Podman workspaces, locally or over SSH",
    cleanUrls: true,
    sitemap: { hostname: "https://www.sshpod.com" },
    vite: {
      // The build output lives under docs/, so keep the dev watcher out of it;
      // otherwise `vitepress dev` reload-loops on its own dist/ and cache/.
      server: { watch: { ignored: ["**/.vitepress/dist/**", "**/.vitepress/cache/**"] } },
      // mermaid pulls in CJS deps; without pre-bundling them the dev server
      // throws on `fastdom` and renders a blank page (the build is unaffected).
      optimizeDeps: {
        include: ["mermaid", "fastdom", "fastdom/extensions/fastdom-promised.js"]
      }
    },
    markdown: {
      // The roadmap mirrors the upstream README checklist.
      config: (md) => md.use(taskLists, { enabled: false, label: false })
    },
    head: [
      ["link", { rel: "icon", href: "/favicon.ico", sizes: "48x48" }],
      ["link", { rel: "icon", type: "image/png", href: "/favicon.png", sizes: "180x180" }],
      ["link", { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }],
      ["meta", { name: "theme-color", content: "#0B6FD1" }],
      ["meta", { property: "og:type", content: "website" }],
      ["meta", { property: "og:title", content: "sshpod" }],
      ["meta", { property: "og:description", content: "Dev Container orchestrator for Podman workspaces, locally or over SSH" }],
      ["meta", { property: "og:url", content: "https://www.sshpod.com/" }],
      ["meta", { property: "og:image", content: "https://www.sshpod.com/social-card.png" }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:image", content: "https://www.sshpod.com/social-card.png" }]
    ],
    themeConfig: {
      logo: "/box.png",
      search: { provider: "local" },
      nav: [
        { text: "Install", link: "/install" },
        { text: "Quick Start", link: "/quick-start" },
        { text: "CLI", link: "/cli" },
        { text: "Roadmap", link: "/roadmap" }
      ],
      sidebar: [
        {
          text: "Getting started",
          items: [
            { text: "Install", link: "/install" },
            { text: "Quick Start", link: "/quick-start" }
          ]
        },
        {
          text: "Guides",
          items: [
            { text: "Providers", link: "/providers" },
            { text: "Dev Containers", link: "/devcontainer" },
            { text: "Configuration", link: "/config" }
          ]
        },
        {
          text: "Reference",
          items: [
            { text: "CLI", link: "/cli" },
            { text: "Roadmap", link: "/roadmap" },
            { text: "About", link: "/about" }
          ]
        }
      ],
      socialLinks: [{ icon: "github", link: "https://github.com/sshpod/sshpod" }],
      editLink: {
        pattern: "https://github.com/sshpod/www/edit/main/docs/:path",
        text: "Edit this page on GitHub"
      },
      footer: { message: "Released under the BSD-3-Clause License" }
    },
    mermaid: {
      theme: "neutral",
      // Wider wrapping keeps every node label to two lines, which mermaid sizes correctly.
      flowchart: { useMaxWidth: true, curve: "basis", wrappingWidth: 260, padding: 22 }
    }
  })
);
