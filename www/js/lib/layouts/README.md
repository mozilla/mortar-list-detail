
# Mortar Layouts

This is a UI library that is used in many of the [mortar](https://github.com/mozilla/mortar) templates. Mortar is a collection of templates that help developers get started writing web apps quickly, whether it's for Firefox OS or other platforms.

It is powered by [backbone.js](http://backbonejs.org/) so that you can quickly use "models" to work with your app's data. Any changes to this data are propagated across the app automatically.

For now, this library is only usable with [require.js](http://requirejs.org/). In the future we will most likely make this optional.

This library requires [backbone.js](http://backbonejs.org/), [zepto](http://zeptojs.com/), [underscore](http://underscorejs.org/), and [x-tags](https://github.com/mozilla/x-tag). If you use the [mortar templates](https://github.com/mozilla/mortar/), all of this is already hooked up for you.

# Usage

## HTML

For the HTML side of things, the layout library introduces two tags:

* **`x-view`**: Represents a "page" in your app, or any chunk of content that needs a header and/or footer. Automatically links to a Backbone view.
* **`x-listview`**: Inherits x-view and adds functionality for managing a list

The `x-view` and `x-listview` tags can have a `header` and/or `footer` element. An `h1` tag in a header specifies the titles, and `button` tags add buttons. Use the `data-view` attribute on a button to make the app automatically open a different view when the button is pressed. Example:

```html
<x-view class="detail">
  <header>
    <h1>Item</h1>
    <button data-view="x-view.edit">Edit</button>
  </header>

  <h1 class="title"></h1>
  <p class="desc"></p>
  <p class="date"></p>

  <footer>
    <button data-view="x-view.delete">Delete</button>
  </footer>  
</x-view>
```

This creates a page with a header with the title "Item" and a button with the text "Edit" that brings up the edit view when pressed, and a footer with a "Delete" button that brings up the delete view. The `data-view` attribute specifies a CSS selector to select a different view.

[View some example HTML](https://github.com/mozilla/mortar-list-detail/blob/master/www/index.html) from the mortar-list-detail template.

## Javascript

For the javascript side of things, you just grab those DOM tags and do stuff with them. Here are the javascript API's:

**`x-view`**:

* `view.titleField = 'title'` -- Set the item field for the title
* `view.render = function(item) { ... }` -- Set the function for rendering the view
* `view.getTitle = function() { ... }` -- Set the function for dynamically generating a title
* `view.model` -- Get or set the model
* `view.onOpen = function() { ... }` -- set a callback for when the view is opened
* `view.open(model, anim)` -- Open the view with the model and animation (both are optional)
* `view.close(anim)` -- Close the view with the animation (optional)

The currently available animations are `instant`, `instantOut`, `slideLeft`, and `slideRightOut`.

**`x-listview`**:

All of the properties/methods from `x-view` are available except `render` and `model`. The following are additional properties/methods:

* `view.renderRow = function(item) { ... }` -- Set the function for rendering a row
* `view.nextView = function(sel) { ... }` -- Set the view to open when a row is selected (as a CSS selector)
* `view.collection` -- Get or set the view's collection
* `view.add(item)` -- Add an item (either a javascript dict or a Backbone model)

[View some example code in the mortar-list-detail project](https://github.com/mozilla/mortar-list-detail/blob/master/www/js/app.js).

For example, to add items to the list, just grab the list tag and add them.

```js
var list = $('.list').get(0);
list.add({ title: "Foo", desc: "Foo is a thing" });
list.add({ title: "Bar", desc: "Bar is something else" });
```

Those items will automatically appear in the list according to your `renderRow` function.

In your HTML, define as many x-views or x-listviews as you want, configure them in javascript, and hook them up to be displayed through user events. You can configure it as much as you want.
