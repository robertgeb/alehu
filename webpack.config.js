var path = require("path");
var webpack =  require("webpack");

var conf = {
	entry: __dirname+'/src/alehu.jsx',
        output: { path: __dirname+'/build', filename: 'alehu.js'},
        watch: true,
        module: {
                loaders : [{
                        test: /.jsx?/,
                        loader: 'babel-loader',
                        exclude: '/node_modules',
                        query: {
                                presets: ['es2015']
                        }
                }]
        }
}

module.exports = conf
