const slugify = require('slugify');
let _ = require("lodash");

/*
List all options from this plugin
categoryCollection
pageCount
categoryVar
itemsCollection

*/

module.exports = function(eleventyConfig, options={
  categoryVar: "categories",
  itemCollection: "posts",
}) {
    const categoryCollection = options.categoryCollection || options.categoryVar;
    const pageCount = options.pageCount || 5

    eleventyConfig.addGlobalData('paginationKeys', {categoryCollection})
    // Creates the collection
    eleventyConfig.addCollection(categoryCollection, function(collections) {

      eleventyConfig.addGlobalData(`ByPage`, 'hello')
      const posts = collections.getFilteredByTag(options.itemsCollection)
      const categoriesTest = posts.map(post => {
        if (!post.data[categoryCollection]) return []
        return post.data[categoryCollection]}).flat()
      const categoriesSet = [...new Set(categoriesTest)]

      const categoriesWithPosts = categoriesSet.map(category => {
        let filteredPosts = posts.filter(post => {
          if (!post.data[categoryCollection]) return false
          return post.data[categoryCollection].includes(category)}
          ).flat();
          
        return { 
          'title': category,
          'slug': slugify(category),
          'posts': [ ...filteredPosts ],
          tags: [categoryCollection],
        };
      })

      return categoriesWithPosts;
    })

    eleventyConfig.addCollection(`${categoryCollection}ByPage`, function(collection) {
        // Get unique list of all tags currently in use
        const posts = collection.getFilteredByTag(options.itemsCollection)
        const tagSet = new Set(posts.flatMap((post) => post.data[options.categoryVar] || []));
        console.log(tagSet)
        // Get each item that matches the tag and add it to the tag's array, chunked by paginationSize
        let paginationSize = pageCount;
        let tagMap = [];
        let tagArray = [...tagSet];
        for(let tagName of tagArray) {
          let tagItems = posts.reverse();
          let pagedItems = _.chunk(tagItems, paginationSize);
          for( let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
            tagMap[pageNumber] ={
              slug: tagName,
              title: tagName,
              totalPages: max,
              posts: pagedItems[pageNumber],
              permalinkScheme: `${tagName}${(pageNumber + 1) > 1 ? `/${pageNumber + 1}` : ''}/index.html`,
              pages: {
                current: pageNumber + 1,
                next: pageNumber != max -1 && pageNumber + 2,
                previous: pageNumber >= 1 &&  pageNumber
              }
            };
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
        console.log(url, isCurrent)
        return `
        <span class="page${isCurrent ? ' currentPage' : ''}">
          ${isCurrent ? pageNumber : `<a href="${url}">${pageNumber}</a>`}
        </span>
        `}).join('')

      const nextHref = next ? ` | <a href="${(current != 1) ? '../' : ''}${next}">Next Page</a>`: ''
      const previousHref = previous ? `<a href="../${previous == 1 ? '' : previous}">Previous Page</a> | `: ''
      const markup = `<nav class="pagination">${previousHref}${pageList}${nextHref} </nav>`
      return markup
    })  

      

}