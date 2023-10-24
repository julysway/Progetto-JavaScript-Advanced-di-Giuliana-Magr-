const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";


const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : "style-loader";



const config = {
    entry: "./src/js/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    devServer: {
        open: true,
        host: "localhost",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            favicon: "./src/img/favicon1.ico",
        }),
    
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,"css-loader"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: "img/[name][ext]",
                },
            },
        ],
    },  
    };

module.exports = () => {
    if (isProduction) {
        config.mode = "production";
        
        config.plugins.push(new MiniCssExtractPlugin());
        
        
    } else {
        config.mode = "development";
    }
    return config;
};
