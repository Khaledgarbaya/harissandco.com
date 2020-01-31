const _ = require(`lodash`)
const Promise = require(`bluebird`)
const path = require(`path`)
const slash = require(`slash`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    graphql(
      `
        {
          allContentfulArticle(limit: 1000) {
            edges {
              node {
                id
                slug
              }
            }
          }
          allContentfulNavigation {
            edges {
              node {
                navigationElements {
                  page {
                    slug
                  }
                }
              }
            }
          }
        }
      `
    )
      .then(result => {
        if (result.errors) {
          reject(result.errors)
        }
        const articleTemplate = path.resolve(`./src/templates/article.js`)
        const pageTemplate = path.resolve(`./src/templates/page.js`)

        _.each(result.data.allContentfulNavigation.edges, edge => {
          _.each(edge.node.navigationElements, navElement => {
            createPage({
              path: navElement.page.slug,
              component: slash(pageTemplate),
              context: {
                slug: navElement.page.slug,
              },
            })
          })
        })
        _.each(result.data.allContentfulArticle.edges, edge => {
          createPage({
            path: `/article/${edge.node.slug}.html`,
            component: slash(articleTemplate),
            context: {
              id: edge.node.id,
              slug: edge.node.slug,
            },
          })
        })
      })
      .then(resolve)
  })
}
