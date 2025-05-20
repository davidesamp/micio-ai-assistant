import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { Configuration, DefinePlugin, WebpackPluginInstance } from "webpack";
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import Dotenv from 'dotenv-webpack'
import "webpack-dev-server";

const port = 4242;
type ConfigBuilder = (
    env: string | unknown,
    argv: { mode: 'production' | 'development' | 'none' | undefined }
) => Configuration

const config: ConfigBuilder = (_, argv) => {
    const isProduction = argv.mode === 'production'

    return {
        mode: argv.mode,
        entry: "./src/index.tsx",
        devtool: "source-map", //TODO remove this in production
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "bundle.js",
            publicPath: '/'
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
            alias: {
                '@': path.resolve(__dirname, 'src/'),
            },
            fallback: {
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: '[name]__[local]___[hash:base64:5]',
                                },
                            },
                        },
                        'sass-loader',
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                    ],
                },
                {
                    test: /\.(gif|png)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'static/media/[name].[ext]',
                                encoding: 'utf-8',
                            },
                        },
                    ],
                },
                {
                    test: /\.svg$/,
                    use: ['@svgr/webpack'],
                },
            ],
        },
        plugins: [
            // initialize plugin to load env variables
            ...!isProduction ? [new Dotenv({ path: '.env' }) as unknown as WebpackPluginInstance] : [
                new DefinePlugin({
                    'process.env': JSON.stringify(process.env)
                })
            ],
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'public',
                        to: 'public',
                        noErrorOnMissing: true,
                        info: {
                            minimized: true,
                        },
                    },
                ],
            }),
            new HtmlWebpackPlugin({
                template: "./public/index.ejs",
                title: 'Micio AI | Your hub for diverse AI services',
                favicon: "./src/icons/logo/micio-ai-favicon.png",
                meta: {
                    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
                    description: 'Micio AI offers a wide range of AI services to enhance your productivity and creativity.',
                },
            }),
            new MiniCssExtractPlugin(),
        ],
        devServer: {
            static: {
                directory: path.join(__dirname, "dist"),
            },
            port,
            hot: true,
            historyApiFallback: true,
            open: [`http://localhost:${port}`],
        },
    }
}

export default config;