const webpack = require('webpack');
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const config = {
  
  entry: './src/js/app.js',
  
  output: {
    path: path.resolve(__dirname, "public/dist"),
    filename: 'bundle.js'
  },

  module:{
    rules: [
      { test: /\.hbs$/, loader: "handlebars-loader" },

      //fonts set-up
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
           
            outputPath: 'fonts/',    // where the fonts will go
               
          }
        }]
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



//   devServer: {
//     contentBase: path.join(__dirname, "public/"),
//     compress: true,
//     stats: "errors-only",
//     open: true
// },
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

      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        proxy: 'http://localhost:8080/',
        files: ['./views/*.hbs', './views/partials/*.hbs', './views/dashba*.hbs']
  }),
  ],
  watch: true,
	devtool: 'source-map'

};
module.exports = config;