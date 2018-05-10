
//
// WebPack config file

const pkg = require("./package.json")
const webpack = require('webpack');

module.exports = {
    plugins: [],
    module: {
        rules: []
    }
}

// The app's starting file
module.exports.entry = [

    /** Polyfills for HF */
    "core-js/fn/function",
    "core-js/fn/object",
    "core-js/fn/symbol",
    "core-js/fn/array",
    "core-js/fn/date",

    /** App main */
    "./src/start.js"

];

// The final app's JS output file
module.exports.output = {
    path: __dirname + "/dist/",
    filename: pkg.name + ".hfscript.js",
    libraryTarget:"var",
    library:"HFScript"
}

// Compile support for ES6 classes etc
module.exports.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    rules: [

        // Compile down to old-style JavaScript
        {
            loader: 'babel-loader',
            options: {
                presets: [require("babel-preset-env")],
            }
        }

    ]
})


module.exports.module.rules.push({
    test: /(\.png|\.svg|\.jpg)$/,
    loader: "url-loader"
})

// Fix High Fidelity's ES3 issues, and return the library at the end
const HighFidelityWebpackPlugin = require("./HighFidelityWebpackPlugin")
module.exports.plugins.push(new HighFidelityWebpackPlugin())
