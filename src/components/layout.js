/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import '../css/style.css'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <div className="container mx-auto h-screen bg-white">
          <Header siteTitle={data.site.siteMetadata.title} />
          <div
            className="bg-cover bg-center w-full min-h-72 h-72 sm:h-128"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2462&q=80',
            }}
          ></div>
          <main className="w-full px-3 py-3 mx-auto relative bg-white">
            {children}
          </main>
          <footer className="w-full px-3 py-3 border-grey border-t text-center">
            © {new Date().getFullYear()}, Built with
            {` `}
            <a href="https://www.gatsbyjs.org">Gatsby</a>
          </footer>
        </div>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
