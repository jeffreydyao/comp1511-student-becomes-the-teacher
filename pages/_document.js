// pages/_document.js

import Document, { Html, Head, Main, NextScript } from "next/document"
import Script from "next/script"

class MyDocument extends Document {
  render () {
    return (
      <Html>
        <Head>
          <link href='https://rsms.me/inter/inter.css' rel='stylesheet' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
