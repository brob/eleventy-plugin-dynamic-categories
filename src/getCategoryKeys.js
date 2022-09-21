module.exports = function(posts, options={}) {
    const tagSet = new Set(posts.flatMap((post) => post.data[options.categoryVar] || []));
    return [...tagSet]
}