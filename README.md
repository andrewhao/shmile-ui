shmile-ui
=========

[![Circle CI](https://circleci.com/gh/andrewhao/shmile-ui.svg?style=svg)](https://circleci.com/gh/andrewhao/shmile-ui)
[![Code Climate](https://codeclimate.com/github/andrewhao/shmile-ui/badges/gpa.svg)](https://codeclimate.com/github/andrewhao/shmile-ui)

This is an extraction of the websocket-driven frontend from [shmile](https://github.com/porkbuns/shmile). Doing so will allow us to develop the frontend separately from the backend with more rigor.

This should also clear the path to begin upgrading the UI to use a stricter MV* framework.

## Installation

    $ npm install
    $ bower install

## Integration

shmile-ui is integratable as a Bower component in shmile.

## Tests

    $ npm install -g karma-cli
    $ gulp test
