import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import rollupJson from "@rollup/plugin-json";
// import commonjs from '@rollup/plugin-commonjs';
import nodePolyfill from "rollup-plugin-polyfill-node";
// import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: './main.js',
    output: [{
        file: 'dist/app.bundle.js',
        format: 'cjs'
    }
    ],
    treeshake: false,
    plugins: [
        resolve({
            jsnext: true,
            main: true,
            browser: true,
            preferBuiltins: true
        }),
        rollupJson(),
        // nodeResolve(),
        commonjs(),
        nodePolyfill()
        /* scss({
            output: "./dist/style.bundle.css",
            verbose: true,
            sourceMap: true,
            watch: "./sass",
            outputStyle: 'compressed',
        }) */
    ]
};