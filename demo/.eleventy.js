const categoryPlugin = require('../.eleventy.js')

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(categoryPlugin, {
        categoryVar: "categories",
        itemsCollection: "posts"
    })
    eleventyConfig.addPlugin(categoryPlugin, {
        categoryVar: "categories",
        itemsCollection: "articles",
        categoryCollection: "articleCategories"
    })
}