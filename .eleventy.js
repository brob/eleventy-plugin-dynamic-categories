const slugify = require('slugify');

module.exports = function(eleventyConfig, options={
  categoryVar: "categories",
  itemCollection: "posts"
}) {
    const categoryCollection = options.categoryCollection || options.categoryVar;
    console.log({categoryCollection})
    eleventyConfig.addCollection(categoryCollection, function(collections) {
        const posts = collections.getFilteredByTag(options.itemsCollection)
        const categoriesTest = posts.map(post => {
          if (!post.data[categoryCollection]) return []
          return post.data[categoryCollection]}).flat()
        const categoriesSet = [...new Set(categoriesTest)]

        const categoriesWithPosts = categoriesSet.map(category => {
          let filteredPosts = posts.filter(post => {
            if (!post.data[categoryCollection]) return false
            return post.data[categoryCollection].includes(category)});
          return { 
            'title': category,
            'slug': slugify(category),
            'posts': [ ...filteredPosts ]
          };
        })
       
        return categoriesWithPosts;
    })
}