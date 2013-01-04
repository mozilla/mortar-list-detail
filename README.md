
# A List/Detail Template for Open Web Apps (beta)

This template comes with a new layouts library that lets you create apps quickly, and initial HTML and javascript that defines a list/detail application.

It is part of the [mortar](https://github.com/mozilla/mortar/)
template collection for building Open Web Apps.

The layouts library is called [mortar-layouts](https://github.com/mozilla/mortar-layouts), and you can read more about it in the project page. It uses [backbone.js](http://backbonejs.org/) to provide a powerful yet minimal application UI framework.

[Check out what the template is by default](http://mozilla.github.com/mortar-list-detail/).

# Usage

There are a few ways to get this template:

* git clone git://github.com/mozilla/mortar-list-detail.git myapp
* volo create myapp mozilla/mortar-list-detail

If you have node installed, you can run a development server with volo:

* cd myapp
* volo serve

View the list/detail app at http://localhost:8008/.

# Customizing

You'll probably want to change how this template works to build your app. The meat of this template is in the [mortar-layouts](https://github.com/mozilla/mortar-layouts) library, which this uses to construct a UI powered by [backbone.js](http://backbonejs.org/). You should [read the documentation](https://github.com/mozilla/mortar-layouts#mortar-layouts) in the mortar-layouts project.
