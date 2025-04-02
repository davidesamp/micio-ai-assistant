module.exports = {
    presets: [
        /**
         * @babel/preset-env is a smart preset that allows you to use the latest JavaScript without needing to micromanage
         */
        "@babel/preset-env",
        /**
         * @babel/preset-react is a smart preset that allows you to use the latest React.js without needing to micromanage
         */
        "@babel/preset-react",
        /**
         * @babel/preset-typescript is a smart preset that allows you to use the latest TypeScript without needing to micromanage
         */
        "@babel/preset-typescript"
    ],
    plugins: [
        /**
         * Added to use toSorted, toSliced, toReversed methods in the code
         * source: https://www.npmjs.com/package/babel-plugin-polyfill-corejs3
         */
        ["polyfill-corejs3", {
            "method": "usage-global",
            "version": "3.20"
        }]
    ]

}