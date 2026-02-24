const repoEnv = process.env.GITHUB_REPOSITORY || "";
const [organizationNameFromEnv = "", projectNameFromEnv = ""] = repoEnv.split("/");

const organizationName = organizationNameFromEnv || "fede";
const projectName = projectNameFromEnv || "jarvis";
const isUserPage = projectName.toLowerCase() === `${organizationName.toLowerCase()}.github.io`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Jarvis Docs",
  tagline: "Documentacion del proyecto",
  url: `https://${organizationName}.github.io`,
  baseUrl: isUserPage ? "/" : `/${projectName}/`,
  trailingSlash: false,

  organizationName,
  projectName,

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn"
    }
  },

  i18n: {
    defaultLocale: "es",
    locales: ["es"]
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js")
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Jarvis",
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Docs"
          },
          {
            href: `https://github.com/${organizationName}/${projectName}`,
            label: "GitHub",
            position: "right"
          }
        ]
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Introduccion",
                to: "/docs/intro"
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Jarvis`
      }
    })
};

module.exports = config;
