module.exports = {
  siteMetadata: {
    title: `Harissan'CO`,
    description: `Popup Brunch Series in Berlin introducing Tunisian cuisine with a modern twist all along the Summer`,
    author: `@harissanco`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        tailwind: true,
        purgeOnly: ['src/css/style.css']
      }
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.HCO_SPACE_ID,
        accessToken: process.env.HCO_ACCESS_TOKEN
      }
    },
  ],
}
