var path = require("path");
var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var StyleLintPlugin = require('stylelint-webpack-plugin');

var templateData = require('./data/data');

module.exports = {
    devtool: 'cheap-source-map', // the best source map for dev. may want to change for production, or remove
    entry: {
        global: './src/', // our global entry point. Feel free to add more here.
        app: './src/app.js' // our global entry point. Feel free to add more here.

    },
    output: {
        path: path.join(__dirname, "dist"), // output into /dist
        filename: "[name].bundle.js",
        chunkFilename: "[id].chunk.js"
    },
    node: {
        Buffer: false // this helps with stylelint
    },
    module: { // set loaders for different file types
        rules: [
            {
              test: /\.(png|gif|jpg|jpeg)$/,
              use: [
                {
                  loader: 'url-loader',
                  options: {name: 'images/[name].[hash:6].[ext]', publicPath: '../', limit: 8192}
                }
              ]
            },
            {
              test: /\.(eot|svg|ttf|woff|woff2)$/,
              use: [
                {
                  loader: 'url-loader',
                  options: {name: 'fonts/[name].[hash:6].[ext]', publicPath: '../', limit: 8192}
                }
              ]
          },
            {
                test: /\.ejs/,
                use: [
                    { loader: 'file-loader?name=[name].html' },
                    { loader: 'ejs-html-loader' }
                ]
            },
            {   // js uses babel and eslint
                test: /\.js/,
                use: ['babel-loader', 'eslint-loader'],
                exclude: /node_modules/
            },
            {   // compile scss with css loader, postcss loader, and sass loader
                test: /\.scss/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                importLoaders: 1
                            }
                        },
                        { loader: 'postcss-loader' },
                        { loader: 'sass-loader' }
                    ]
                })
            },
            {   // compile css in the same way, without the sass loader
                test: /\.css/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                importLoaders: 1
                            }
                        },
                        { loader: 'postcss-loader' }
                    ]
                })
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({ // [TO] expose jquery to all modules
            $: 'jquery'
        }),
        new ExtractTextPlugin("[name].css"), // extract css into a separate file
        new CommonsChunkPlugin({ // pull out common chunks into separate bundles
            filename: "app.js",
            name: "app"
        }),
        new StyleLintPlugin({ // stylelint configuration
            context: "./src",
            configFile: '.stylelintrc',
            files: '**/*.scss',
            failOnError: false,
            quiet: false
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [ // postcss plugins
                    require("postcss-cssnext"),
                    require("postcss-reporter")({ clearMessages: true })
                ],
                ejsHtml: {
                    context: templateData
                }
            }
        })
    ],
    resolve: {
        modules: [ path.join(__dirname, './src'), path.join(__dirname, './node_modules') ],
        extensions: ['.js', '.scss', '.css']
    }
}
