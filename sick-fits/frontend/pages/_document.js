import Document, { Html, Head, NextScript, Main } from 'next/document';
import Page from '../components/Page';

export default class MyDocument extends Document {
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
