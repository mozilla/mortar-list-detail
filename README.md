
h1. A List/Detail Template for Open Web Apps

This template comes with a new layouts library that lets you create apps quickly, and initial HTML and javascript that defines a list/detail application.

It uses [backbone.js](http://backbonejs.org/), [zepto](http://zeptojs.com/), and [underscore](http://underscorejs.org/) to provide a powerful yet minimal application development environment.

It also make light usags of [x-tags](https://github.com/mozilla/x-tag), a polyfill for the new [Web Components](http://dvcs.w3.org/hg/webcomponents/raw-file/tip/explainer/index.html) API.

# Usage

There are a few ways to get this template:

* git clone FOO myapp
* volo create myapp mozilla/mortar-list-detail

If you have node installed, you can run a development server with volo:

* cd myapp
* volo serve

View the list/detail app at http://localhost:8008/.

# Customizing

You'll probably want to change how this template works to build your app. You can do that be working with the [backbone](http://backbonejs.org/) structure underlying the whole thing.

For the HTML side of things, the layout library introduces three tags:

* **`x-app`**: A root element for your app
* **`x-view`**: Represents a "page" in your app, and binds to a Backbone view
* **`x-listview`**: Inherits `x-view` and adds functionality for managing a list

The `x-view` and `x-listview` tags can have a `header` element which specifies what should be in the header. Add buttons to your liking!

For the javascript side of things, you just grab those DOM tags and do stuff with them. Here are the javascript API's:

**`x-view`**:

* `view.titleField = 'title'` -- Set the item field for the title
* `view.render = function(item) { ... }` -- Set the function for rendering the view
* `view.getTitle = function() { ... }` -- Set the function for dynamically generating a title
* `view.model` -- Get or set the model
* `view.open()` -- Open the view
* `view.close()` -- Close the view

**`x-listview`**:

* `view.titleField = 'title'` -- Set the item field for the title
* `view.renderRow = function(item) { ... }` -- Set the function for rendering a row
* `view.nextView = function(sel) { ... }` -- Set the view to open when a row is selected (as a CSS selector)
* `view.collection` -- Get or set the view's collection
* `view.add(item)` -- Add an item (either a javascript dict or a Backbone model)
* `view.open()` -- Open the view
* `view.close()` -- Close the view

In your HTML, define as many x-views or x-listviews as you want, configure them in javascript, and hook them up to be displayed through user events. You can configure it as much as you want.