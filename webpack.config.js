const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Webpack = require('webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const config = {
  mode: process.env.NODE_ENV !== 'prod' ? 'development' : 'production',
  entry: {
    main: path.resolve(__dirname, 'src/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].[contenthash].js',
    clean: true,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      // these aliases are for client only
      '@client': path.resolve(__dirname, 'src'),
      '@static': path.resolve(__dirname, 'src', 'static'),
      '@components': path.resolve(__dirname, 'src', 'Components'),
      '@pages': path.resolve(__dirname, 'src', 'Pages'),
      '@services': path.resolve(__dirname, 'src', 'services'),
    },
  },
  devtool: 'inline-source-map',
  // loaders
  module: {
    rules: [
      // css
      {
        test: /\.css$/i,
        // if in case, we are planning to use sass or less, add the needed packages and update webpack as well
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      // images
      {
        test: /\.(svg|ico|png|webp|gif|jpe?g)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name].[contenthash:6][ext]',
        },
      },
      // js for babel
      {
        test: /\.jsx?$/,
        // exclude node_modules & the test files & directories
        exclude: /node_modules|cypress|.*\.test\.jsx?$/,
        use: ['babel-loader'],
      },
      // tsx typescript react
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: { noEmit: false },
          },
        },
        exclude: /node_modules/,
      },
      // font files if in case we use any
      // create a resource
      {
        test: /\.(eot|ttf|woff2?)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][contenthash:6][ext]',
        },
      },
    ],
  },
  // plugins
  plugins: [
    new Webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'local'),
      BASE_URL: JSON.stringify(process.env.BASE_URL || 'localhost:17011'),
    }),
    // add another plugin for lossless compression on images if we are adding more images
    new HtmlWebpackPlugin({
      inject: true,
      hash: false,
      manifest: './public/manifest.json',
      favicon: './public/favicon.ico',
      template: './public/index.html',
    }),
    // value for the use by the template engine while rendering the index file in public dir
    new InterpolateHtmlPlugin({
      PUBLIC_URL: '',
    }),
    new CompressionPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:6].css',
      chunkFilename: 'static/css/[name].[contenthash:6].chunk.css',
    }),
    new Webpack.IgnorePlugin({
      // moment.js bundles large locale files by default
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // moment.js will be used for any datetime manipulate
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
    }),
    // Generate an asset manifest file with the following content:
    // - "files" key: Mapping of all asset filenames to their corresponding
    //   output file so that tools can pick it up without having to parse
    //   `index.html`
    // - "entrypoints" key: Array of files which are included in `index.html`,
    //   can be used to reconstruct the HTML if necessary
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: path.resolve(__dirname, 'build'),
      generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          // eslint-disable-next-line no-param-reassign
          manifest[file.name] = file.path;
          return manifest;
        }, seed);
        const entrypointFiles = entrypoints.main.filter(
          (fileName) => !fileName.endsWith('.map'),
        );
        return {
          files: manifestFiles,
          entrypoints: entrypointFiles,
        };
      },
    }),
  ],
  performance: {
    // performance threshold
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
    hints: false,
  },
};

if (process.env.NODE_ENV === 'prod') {
  const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
  const TerserPlugin = require('terser-webpack-plugin');
  config.devtool = false; // Manage source maps generation process. Reference https://webpack.js.org/configuration/devtool/#production
  config.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      // customise it off default if needed
      chunks: 'all',
    },
  };
} else {
  config.devServer = {
    static: path.resolve(__dirname, 'build'),
    port: process.env.PORT || 3001,
    historyApiFallback: true,
    open: true,
    hot: true,
    compress: true,
    client: {
      progress: true,
    },
    devMiddleware: {
      serverSideRender: true,
      index: true,
    },
  };
}

module.exports = config;
