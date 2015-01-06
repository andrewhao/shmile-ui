shmile-ui
=========

This is an extraction of the websocket-driven frontend from
[shmile](https://github.com/porkbuns/shmile). Doing so will allow us to develop the frontend separately from the backend with more testing rigor.

This should also clear the path to begin upgrading the UI to use a stricter MV* framework. We are open to suggestions: [React.js](http://facebook.github.io/react/) + [d3](http://d3js.org/), or perhaps [Angular](https://angularjs.org/) + [Famo.us](http://famo.us/)?

## Installation

    $ npm install
    $ bower install

## Integration

shmile-ui is integratable as a Bower component in shmile.

## Tests

    $ npm install -g karma-cli
    $ gulp test
