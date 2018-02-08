const webpack = require('webpack');
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
  
  entry: './src/js/app.js',
  
  output: {
    path: path.resolve(__dirname, "public/dist"),
    filename: 'bundle.js'
  },

  module:{
    rules: [
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
        loader: "file-loader"
    },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use:[

     
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
        use: [ 'babel-loader' ]
      },
  
    { test: /\.scss$/,
      use: ExtractTextPlugin.extract({
   fallback: "style-loader",
   use: ["css-loader",'postcss-loader',"sass-loader" ],
  // publicPath: "./"
  })
}
    ]
  },



  devServer: {
    contentBase: path.join(__dirname, "public/dist"),
    compress: true,
    stats: "errors-only",
    open: true
},
  plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      
      

      }),
     new ExtractTextPlugin({
        filename: "style.css",
       disable: false,
       allChunks: true
      }),


  ],
  watch: true,
	devtool: 'source-map'

};
module.exports = config;