// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import("@docusaurus/types").Config} */
const config = {
  title: "IdhagnBot",
  tagline: "🐱 基于 Nonebot2 的缝合怪 QQ 机器人 🤖",
  url: "https://idhagnbot.su226.tk",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "logo.png",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "su226", // Usually your GitHub org/user name.
  projectName: "IdhagnBot-docs", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans"],
  },

  presets: [
    [
      "classic",
      /** @type {import("@docusaurus/preset-classic").Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/su226/IdhagnBot-docs/edit/main",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
        language: ["en", "zh"],
      })
    ]
  ],

  themeConfig:
    /** @type {import("@docusaurus/preset-classic").ThemeConfig} */
    ({
      navbar: {
        title: "IdhagnBot",
        logo: {
          alt: "IdhagnBot Logo",
          src: "logo.png",
        },
        items: [
          {
            label: "指南",
            type: "docSidebar",
            sidebarId: "guide",
          },
          {
            label: "API",
            type: "docSidebar",
            sidebarId: "api",
          },
          {
            label: "杂项",
            type: "docSidebar",
            sidebarId: "misc",
          },
          {
            href: "https://su226.tk/",
            label: "博客",
            position: "right",
          },
          {
            href: "https://github.com/su226/IdhagnBot",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            label: "作者博客",
            to: "https://su226.tk",
          },
          {
            label: "GitHub",
            to: "https://github.com/su226/IdhagnBot",
          },
          {
            label: "Nonebot2",
            to: "https://v2.nonebot.dev/",
          },
        ],
        copyright: `<a href="https://github.com/su226">su226</a> 制作，文档使用 <a href="https://docusaurus.io">Docusaurus</a> 生成，托管在 <a href="https://vercel.com">Vercel</a><br>Idhagn ♥ You`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
