import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ArticleLink from "../components/article-link"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS } from "@contentful/rich-text-types"

const PageTemplate = ({ data }) => {
  let { articles, content } = data.contentfulPage
  content = content || {}
  articles = articles || []

  const options = {
    renderNode: {
      [BLOCKS.HEADING_1]: (node, children) => {
        return (
          <h1 className="font-heading text-5xl w-full text-center inline-block mb-5">
            {children}
          </h1>
        )
      },
      [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
        console.log(node)
        return (
          <img
            className="mx-auto"
            src={node.data.target.fields.file["en-US"].url}
            alt={node.data.target.fields.title["en-US"]}
          />
        )
      },
    },
  }

  return (
    <Layout>
      <SEO title="Harissa'n co" />
      <div className="mx-auto p-4">
        {documentToReactComponents(content.json, options)}
      </div>
      <div className="flex justify-center mx-auto p-2 flex-wrap">
        {articles.map(article => (
          <ArticleLink key={article.id} article={article} />
        ))}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query NewPageQuery($slug: String!) {
    contentfulPage(slug: { eq: $slug }) {
      title
      slug
      content {
        json
      }
      articles {
        author {
          fullName
        }
        title
        id
        slug
        publishDate
        excerpt
        tags
        featureImage {
          title
          file {
            url
          }
        }
      }
    }
  }
`
export default PageTemplate
