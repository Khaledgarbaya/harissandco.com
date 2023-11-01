import { ReactElement } from "react"
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document"

type CustomDocumentProps = DocumentInitialProps

class AppDocument extends Document<CustomDocumentProps> {
  // Docs: https://docs.uniform.app/docs/guides/personalization/activate-personalization#server-side

  render(): ReactElement {
    return (
      <Html lang="en" className="h-full w-full">
        <Head />
        <body className="bg-white h-full w-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument
