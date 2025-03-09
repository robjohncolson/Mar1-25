import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Preload Chicago font for Mac OS 6 look */}
          <link
            rel="preload"
            href="https://cdn.jsdelivr.net/gh/virtualgeoff/chicago@master/ChicagoFLF.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="AP Statistics Hub - A comprehensive resource for AP Statistics students and teachers" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 