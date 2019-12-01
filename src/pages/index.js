import React from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div className="flex justify-center  mx-auto p-2 flex-wrap">
      {Array.from({ length: 3 }).map(_ => (
        <div className="w-full lg:max-w-sm sm:w-1/3 rounded overflow-hidden m-2 shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80"
            alt="food"
            className="w-full"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Tunisian Brunch</div>
            <p className="text-gray-700 text-base">
              join our first Pop-up Brunch.
            </p>
          </div>
          <div className="px-6 py-4">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-1">
              #food
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-1">
              #tunisia
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              #brunch
            </span>
          </div>
        </div>
      ))}
    </div>
  </Layout>
)

export default IndexPage
