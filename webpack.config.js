const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env),
            'process.browser': true
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser'
        })
    ],
    resolve: {
        fallback: {
            process: require.resolve('process/browser')
        }
    }
};
