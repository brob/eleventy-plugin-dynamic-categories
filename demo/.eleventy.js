const categoryPlugin = require('../.eleventy.js')

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(categoryPlugin, {
        categoryVar: "categories",
        itemsCollection: "posts",
        perPageCount: 4
    })
    eleventyConfig.addPlugin(categoryPlugin, {
        categoryVar: "articleCategories",
        itemsCollection: "articles",
        perPageCount: 2
    })
    eleventyConfig.addPassthroughCopy('assets')
}