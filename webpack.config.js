const webpack = require('webpack');
var path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");


const config = {
  
  entry: './src/js/app.js',
  
  output: {
    path: __dirname + '/public/js',
    filename: 'bundle.js'
  },

  module:{
    rules: [

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      },
  
    { test: /\.scss$/,
      use: ExtractTextPlugin.extract({
   fallback: "style-loader",
   use: ["css-loader",'postcss-loader',"sass-loader" ],
   publicPath: "/public/css"
  })
}
    ]
  },

  devServer: {
    contentBase: path.join(__dirname, "/public/js"),
    compress: true,
    stats: "errors-only",
    open: true
},
  plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default']

      }),
     new ExtractTextPlugin({
        filename: "style.css",
       disable: false,
       allChunks: true
      }),

  ],
  watch:true
};
module.exports = config;