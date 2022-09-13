const slugify = require('slugify');

module.exports = function(eleventyConfig, options={
  categoryVar: "categories",
  itemCollection: "posts"
}) {
    const categoryCollection = options.categoryCollection || options.categoryVar;
    console.log({categoryCollection})
    eleventyConfig.addCollection(categoryCollection, function(collections) {
        console.log(options)
        let categories = [];
        let sortedPosts = [];
        const posts = collections.getFilteredByTag(options.itemsCollection)

        posts.forEach(post => {
          categories = [...new Set([...categories, ...post.data[categoryCollection]])];
        });
        categories.forEach(category => {
          let filteredPosts = posts.filter(post => post.data[categoryCollection].includes(category));
          let categoryDetails =  { 
            'title': category,
            'slug': slugify(category),
            'posts': [ ...filteredPosts ]
          };
          sortedPosts.push(categoryDetails);      
        });
        return sortedPosts;
    })
}