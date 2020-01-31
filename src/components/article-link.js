import React from "react"
import Img from "gatsby-image"
import { Link } from "gatsby"

const ArticleLink = ({ article }) => {
  return (
    <div className="w-full lg:max-w-sm sm:w-1/3 rounded overflow-hidden m-2 shadow-lg">
      <img
        src={`https:${article.featureImage.file.url}`}
        alt={article.featureImage.title}
        className="w-full"
      />
      <div className="px-6 py-4">
        <Link
          to={`/articles/${article.slug}`}
          className="border-transparent border-b hover:border-gray-900 font-bold text-xl mb-2"
        >
          {article.title}
        </Link>
        <p className="text-gray-700 text-base">{article.excerpt}</p>
      </div>
      <div className="px-6 py-4">
        {article.tags.map((tag, i) => (
          <span
            key={i}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-1"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default ArticleLink
