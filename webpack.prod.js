const webpack = require('webpack');
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')




const config = {

  entry: './src/js/app.js',

  output: {
    path: path.resolve(__dirname, "public/build"),
    filename: 'bundle.js'
  },

  module: {
    rules: [{
        test: /\.hbs$/,
        loader: "handlebars-loader"
      },

      //fonts set-up
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {

            outputPath: 'fonts/', // where the fonts will go

          }
        }]
      },

      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [


          {
            loader: 'file-loader',
            options: {
              name: 'assets/images/[name].[ext]',
            }

          },
          {
            loader: 'image-webpack-loader',
            options: {
              query: {
                mozjpeg: {
                  progressive: true,
                },
                gifsicle: {
                  interlaced: true,
                },
                optipng: {
                  optimizationLevel: 9,
                }
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },

      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
              loader: "css-loader",
              options: {
                minimize: true
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]

          // publicPath: "./"
        })
      }
    ]
  },




  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      $: 'jquery',
      'window.$': 'jquery'


    }),

    new ExtractTextPlugin({
      filename: "style.css",
      disable: false,
      allChunks: true
    }),
    new UglifyJsPlugin({
      test: /\.js($|\?)/i
    }),

  ],
  watch: true,
  devtool: 'source-map'

};
module.exports = config;
