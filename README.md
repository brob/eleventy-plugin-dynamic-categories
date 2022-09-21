# Eleventy Dynamic Categories

This plugin is super alpha! 

This plugin will accept a category name and a collection name and create data that can be used to create or display category lists for content.

It creates two collections. One is named either the `categoryVar` or `categoryCollection` configuration string. This has all posts in the category. The other is named that same string with `ByPage` appended to create a category collection that is paginated.

Example:

When you initialize with a `categoryVar` or `categoryCollection` of `categories`, the plugin will create two collections: `categories` and `categoriesByPage`. ``categories` is a collection where each item has the following data:

```js
{
    "title": "Category Name",
    "slug": "category-name",
    "posts": [ /* full array of posts in the category */ ]
}
```

This is great for simple loops or for categories with small amounts of content.

You also get `categoriesByPage` which allows you to use 11ty's Pagination functionality to go deeper and paginate posts per category, as well, with more data and helper functions. Each category page has the following information (required for making the pages)

```js
{
    "title": "Category Name",
    "slug": "category-name",
    "posts": [ /* array of posts in the category on this page */ ],
    "permalinkScheme": "category-name/:num/",
    "totalPages": 4,
    "pages": {
        "current": 1,
        "next": 2,
        "previous": false // (or num)
    }
}

```
This is pretty abstract. There are examples below that should hopefully clarify.

## Installation

Install the plugin with 

```sh
npm install eleventy-plugin-dynamic-categories
```
### Configure

Add the plugin to your `.eleventy.js` config file. Provide the plugin with the name of the variable that you use in your frontmatter to assign categories to your content. Use `itemsCollection` to specify the key for which collection you want to use.

|property|description|type|default|
|---|---|---|---|
|`categoryVar`|The name of the variable in your frontmatter that you use to assign categories to your content.|`string`|`categories`|
|`itemsCollection`|The name of the collection you want to categorize.|`string`|`posts`|
|`perPageCount`|The number of items to display per page.|`int`|`5`|
|`categoryCollection`|The name of the collection that will be created by the plugin (must be unique).|`string`|`categories`|


```js
const dynamicCategories = require('eleventy-plugin-dynamic-categories');

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(dynamicCategories, {
        categoryVar: "categories", // Name of your category variable from your frontmatter (default: categories)
        itemsCollection: "posts", // Name of your collection to use for the items (default: posts)
        categoryCollection: "categories", // Name of the new collection to use for the categories (default: value in categoryVar)
        // categoryCollection MUST be unique currently
        perPageCount: 5 // Number of items to display per page of categoriesByPage (default: 5)
    })
}
```

## Build or loop through your categories

The plugin creates a data structure of an array of categories that contain a title (based on the string for each category), a slug to be used for URLs (slugified from the category name), and an array of items that are assigned to that category. The data is stored as an 11ty Collection with the key of the `categoryVar` you specified or overridden by the `categoryCollection` you specified. The collection name must be unique.


### Usage for pagination:

```html
---
pagination:
    data: collections.categories
    alias: category
    size: 1
permalink: /blog/category/{{ category.slug }}/
---

{% for post in category.posts %}
<li>
    <a href="{{ post.url }}">{{ post.data.title }}</a>
</li>
{% endfor %}
```

### Usage for a loop: 

```html
<h1>Categories</h1>
{% for category in collections.categories %}
    <div>
        <h2><a href="/blog/category/{{category.slug}}/">{{ category.title }}</a></h2>
        <ul>
            {% for post in category.posts %}
                <h3>{{ post.data.title }}</h3>
            {% endfor %}
        </ul>
    </div>
{% endfor %}
```

## Paginated Category template example

```html
---
layout: base.html
# Default permalink scheme (still able to be customized)
permalink: /posts/{{category.permalinkScheme}}
pagination:
  data: collections.categoriesByPage
  size: 1
  alias: category
  addAllPagesToCollections: true
eleventyComputed:
  title: Blog entries with category &quot;{{ category.slug }}&quot; {% if tcategoryag.pageNumber > 0 %}, (Page {{ category.pageNumber + 1 }}) {% endif %}
---

{% for post in category.posts %}
<li>
    <a href="{{post.url}}">{{ post.data.title }} yo</a>
</li>
{% endfor %}


{# This can still be customized, but then there's markup for basic pagination #}
{% pagination category %}
```


## Multiple Category usage
If you need to create multiple categories out of multiple collections, you can add the plugin multiple times with different configruations.

```js
const dynamicCategories = require('eleventy-plugin-dynamic-categories');

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(dynamicCategories, {
        categoryVar: "categories", // Name of your category variable from your frontmatter (default: categories)
        itemsCollection: "posts", // Name of your collection to use for the items (default: posts)
        categoryCollection: "categories" // Name of the new collection to use for the categories (default: value in categoryVar)
        // categoryCollection MUST be unique currently
    })
    eleventyConfig.addPlugin(dynamicCategories, {
        categoryVar: "categories2", // Name of your category variable from your frontmatter (default: categories)
        itemsCollection: "posts", // Name of your collection to use for the items (default: posts)
        categoryCollection: "categories2" // Name of the new collection to use for the categories (default: value in categoryVar)
        // categoryCollection MUST be unique currently
    })
}
```

## Pagination template tag
The pagination template tag is a helper tag that generates markup for basic pagination to save template overhead. It accepts the page information from the pagination item (usually aliased to something like `category`).

For each page, this will generate pagination that includes next and previous links as well as a list of page numbers. The current page will be styled as active.

### Usage
```html
{% pagination category %}
```

