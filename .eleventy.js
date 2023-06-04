const slugify = require('slugify');
let _ = require("lodash");
const getCategoryKeys = require('./src/getCategoryKeys.js')

/*
List all options from this plugin
categoryVar
categoryCollection
perPageCount
itemsCollection

*/

module.exports = function(eleventyConfig, options={
  categoryVar: "categories",
  itemCollection: "posts",
}) {
    const categoryCollection = options.categoryCollection || options.categoryVar;
    const perPageCount = options.perPageCount || 5

    // Creates the collection
    eleventyConfig.addCollection(categoryCollection, function(collections) {

      const posts = collections.getFilteredByTag(options.itemsCollection)
      let tagArray = getCategoryKeys(posts, options);

      const categoriesWithPosts = tagArray.map(category => {
        let filteredPosts = posts.filter(post => {
          if (!post.data[categoryCollection]) return false
          return post.data[categoryCollection].includes(category)}
          ).flat();
          console.log(slugify(category))
        return { 
          'title': category,
          'slug': slugify(category),
          'posts': [ ...filteredPosts ],
        };
      })
      console.log(`\x1b[32m[Dynamic Categories] Created Collection ${categoryCollection} with ${categoriesWithPosts.length} items`, '\x1b[0m')
      return categoriesWithPosts;
    })

    eleventyConfig.addCollection(`${categoryCollection}ByPage`, function(collection) {
        // Get unique list of all tags currently in use
        const posts = collection.getFilteredByTag(options.itemsCollection)

        // Get each item that matches the tag and add it to the tag's array, chunked by paginationSize
        let paginationSize = perPageCount;
        let tagMap = [];
        let tagArray = getCategoryKeys(posts, options);

        for(let tagName of tagArray) {
          const filteredPosts = posts.filter(post => {
            if (!post.data[categoryCollection]) return false
            return post.data[categoryCollection].includes(tagName)}
            ).flat();

          let tagItems = filteredPosts.reverse();
          let pagedItems = _.chunk(tagItems, paginationSize);
          const totalPages = Math.ceil(filteredPosts.length / perPageCount)
          for( let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
            const currentNumber = pageNumber + 1
            const slug = slugify(tagName)
            tagMap.push({
              slug,
              title: tagName,
              totalPages,
              posts: pagedItems[pageNumber],
              permalinkScheme: `${slug}${currentNumber > 1 ? `/${currentNumber}` : ''}/index.html`,
              pages: {
                current: currentNumber,
                next: currentNumber != totalPages && currentNumber + 1,
                previous: currentNumber > 1 &&  currentNumber - 1
              }
            });
          }
        }
        // Return a two-dimensional array of items, chunked by paginationSize
        return tagMap;
    });
      
    eleventyConfig.addShortcode('pagination', function(page) {
      const {pages} = page
      const {current, next, previous} = pages
      const allNumbers = Array.from(Array(page.totalPages).keys())

      const pageList = allNumbers.map(number => {
        const pageNumber = number+1;
        const urlBase = current == 1 ? './' : '../'
        const url = pageNumber === 1 ? `${urlBase}` : `${urlBase}${pageNumber}`
        const isCurrent = pageNumber === current;

        return `
        <span class="pagination-page${isCurrent ? ' currentPage' : ''}">
          ${isCurrent ? pageNumber : `<a href="${url}">${pageNumber}</a>`}
        </span>
        `}).join('')

      const nextHref = next ? `<a class="pagination-page" href="${(current != 1) ? '../' : ''}${next}">Next Page</a>`: '<span class="pagination-page">Next Page</span>'
      const previousHref = previous ? `<a class="pagination-page" href="../${previous == 1 ? '' : previous}">Previous Page</a>`: '<span class="pagination-page">Previous Page</span>'
      const markup = `<nav class="pagination">${previousHref}${pageList}${nextHref} </nav>`
      return markup
    })  

      

}