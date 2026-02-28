const webpack = require('webpack');

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://hlsr-shift-manager-api-exb2eefchxaucsfe.westcentralus-01.azurewebsites.net',
        changeOrigin: true,
        headers: {
          'X-Functions-Key': process.env.REACT_APP_API_KEY || '',
        },
      },
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Add plugin to handle node: protocol
      webpackConfig.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          const mod = resource.request.replace(/^node:/, '');
          
          switch (mod) {
            case 'events':
              resource.request = 'events';
              break;
            case 'process':
              resource.request = 'process/browser.js';
              break;
            case 'buffer':
              resource.request = 'buffer';
              break;
            case 'stream':
              resource.request = 'stream-browserify';
              break;
            case 'util':
              resource.request = 'util';
              break;
            default:
              resource.request = mod;
          }
        })
      );

      webpackConfig.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser.js'),
        url: require.resolve('url/'),
        assert: require.resolve('assert/'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
        querystring: require.resolve('querystring-es3'),
        os: require.resolve('os-browserify/browser'),
        events: require.resolve('events/'),
        // These cannot be polyfilled in browser
        net: false,
        tls: false,
        fs: false,
        path: false,
        http2: false,
        child_process: false,
      };
      
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser.js',
          Buffer: ['buffer', 'Buffer'],
        })
      );

      // Add DefinePlugin to polyfill process.stdout and process.stderr
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          'process.stdout': JSON.stringify({ isTTY: false }),
          'process.stderr': JSON.stringify({ isTTY: false }),
        })
      );
      
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
      ];
      
      return webpackConfig;
    },
  },
};
