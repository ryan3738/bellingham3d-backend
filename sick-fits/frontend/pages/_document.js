import Document, { Html, Head, NextScript, Main } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Page from '../components/Page';

// Server style sheet for styled components on next.js
// This forces next.js to look for styled components and prerender them.
export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage((App) => (props) =>
      sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    console.log(styleTags);
    return { ...page, styleTags };
  }

  render() {
    return (
      <Html lang="en">
        {/* <Head></Head> */}
        <body>
          <Head />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
