const path = require("path");

module.exports = {
    watch: true,
    mode: "development",
    entry: path.join(__dirname, "main.js"),
    output: {
        filename: "app.bundle.js",
        path: path.join(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            }
        ]
    }
}