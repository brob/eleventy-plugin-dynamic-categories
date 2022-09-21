const categoryPlugin = require('../.eleventy.js')

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(categoryPlugin, {
        categoryVar: "categories",
        itemsCollection: "posts",
        pageCount: 2
    })
    eleventyConfig.addPlugin(categoryPlugin, {
        categoryVar: "articleCategories",
        itemsCollection: "articles",
        pageCount: 2
    })
    eleventyConfig.addPassthroughCopy('assets')
}