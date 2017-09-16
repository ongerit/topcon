# Webpack with EJS templating
This example builds off of the [**webpack example**](/boilerplate/webpack) and layers on ejs templating functionality. All other aspects of this build are the same. This uses the webpack [**`ejs-html-loader`**](https://github.com/mcmath/ejs-html-loader) to process templates and partials with webpack, and will build out all html files into `/dist`

## Template Workflow

### Data
Data is laid out in the [**`data/data.js`**](./data/data.js) file as an object. Properties can be nested as you see fit. For example:
```javascript
    var data = {
        page1: {
            title: 'page 1 title'
        },
        page2: {
            title: 'page 2 title'
        }
    }
```

This can then be used in *any* of your templates or partials with the `this` context:
```html
    <%= this.page1.title %>
```

## Templates/Partials
Templates and partials are all contained in [**`./src/templates/`**](./src/templates/) - they can be organized into sub-folders within here if you'd prefer. Note that this will change your partial references.

In typical webpack-fashion, pages will be built out as they are referenced from your entry-point. In this example, the entry point is [**`./src/index.js`**](./src/index.js) - if you're going to be building out multiple pages, you can use this index file to list out all of your separate pages. Further, if you want to compile all the ejs partials in the `/src` directory automatically, there is code in the [**`index.js`**](./src/index.js) that allows for this (currently commented out):
```javascript
// initial script/style imports
import './index.scss';

// build out HTML (choose one method below)
// 1) build individual pages
import './templates/index.ejs';
// OR
// 2) automatically build all ejs files in /src
// var req = require.context('.', true, /\.ejs$/);
// req.keys().map(req);
```

Templates and partials follow the traditional ejs syntax. Partials can be referenced as shown in [**`index.ejs`**](./src/templates/index.ejs). Partials have access to the same `this` context for variable access.
```html
<h1><%= this.page1.title %></h1>
<h2><%= this.page1.subtitle %></h2>

<% include header %>
```

### Webpack
There's a minimal amount of modification that needs to be done to the [**`webpack.config.js`**](./webpack.config.js).

First, make sure to [**import your data object**](https://github.com/codeandtheory/frontend-toolkit/blob/master/boilerplate/webpack-ejs/webpack.config.js#L7):
```javascript
    var templateData = require('./data/data');
```

Then add the [**loader rule for .ejs files**](https://github.com/codeandtheory/frontend-toolkit/blob/master/boilerplate/webpack-ejs/webpack.config.js#L25). This will go through the file-loader as well to output actual html files:
```javascript
    {
        test: /\.ejs/,
        use: [
            { loader: 'file-loader?name=[name].html' },
            { loader: 'ejs-html-loader' }
        ]
    }
```

Finally, point the `context` option to the object you set up in [** webpack's LoaderOptionPlugins section**](https://github.com/codeandtheory/frontend-toolkit/blob/master/boilerplate/webpack-ejs/webpack.config.js#L90). This will assign `this` in all of your templates and partials to that object.
```javascript
    ejsHtml: {
        context: templateData
    }
```

## Running
* **`yarn install`** - install all necessary packages
* **`yarn dev`** - watch and recompile on change (does not watch `/data` directory. so any changes to your data file will require restarting webpack)
* **`yarn prod`** - build out files for prod

