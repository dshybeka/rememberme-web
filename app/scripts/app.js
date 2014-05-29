var RemembermeWeb = window.RemembermeWeb = Ember.Application.create();

/* Order and include as you please. */
require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/views/*');
require('scripts/router');

Ember.Handlebars.helper('format-markdown', function(input) {
  return new Handlebars.SafeString(new Showdown.converter().makeHtml(input));
});