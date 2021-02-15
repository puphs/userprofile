import React from 'react';
import App from 'next/app';

import 'semantic-ui-offline/semantic.min.css'
//import '../.semantic/dist/semantic.min.css';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}

export default MyApp;
