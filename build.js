#!/usr/bin/env node
const fs = require('fs');
const path = require('path')
const esbuild = require('esbuild');
const sveltePlugin = require('esbuild-svelte');
const pursPlugin = require('esbuild-plugin-purescript')

const isProd = process.env.NODE_ENV === 'production'

//make sure the directoy exists before stuff gets put into it
if (!fs.existsSync('./dist/')) {
    fs.mkdirSync('./dist/');
}

//build the application
esbuild
    .build({
        entryPoints: ['./entry.js'],
        outdir: './dist',
        format: 'esm',
        bundle: true,
        minify: true,
        splitting: true,
        watch: !isProd,
        sourcemap: isProd ? false : 'inline',
        plugins: [
            sveltePlugin({ cache: false }),
            pursPlugin()
        ],
    })
    .catch((err) => {
        console.error(err);
        if (isProd) process.exit(1);
    });

//use a basic html file to test with
fs.copyFile('./index.html', './dist/index.html', (err) => {
    if (err) throw err;
});
