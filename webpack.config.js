var webpack = require("webpack"),
    path = require('path');

var buildPath = path.resolve(__dirname, 'build/');

var plugins = [
    new webpack.ProvidePlugin({ // Expos
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    })
]

module.exports = {
    target: "web",
    devtool: 'source-map',
    entry: {
        entry: "./src/entry.js",
        entry2: "./src/entry2.js",
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry'
    },
    output: {
        path: buildPath,
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [
            // Stylesheets can be required in JS.
            { test: /\.css$/, loader: "style!css" },
            {
              test: /\.less$/,
              loader: "style!css!less"
            },
            { // Transpile es6 and react-jsx resources
                test: /\.js?$/,
                exclude: /(node_modules|bower_components|common\/jquery)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015'],
                    cacheDirectory: true
                }
            },
            // Expose $ and jQuery on window in order for out old jquery libs to work properly
            { test: /jquery\.js$/, loader: 'expose?$' },
            { test: /jquery\.js$/, loader: 'expose?jQuery' }

        ]
    },
    plugins: plugins
};
