RemembermeWeb.AuthentificatedRoute = Ember.Route.extend({

  beforeModel: function(transition) {

    if (!this.isValidToken()) {
      this.redirectToLogin(transition);
    }
  },

  redirectToLogin: function(transition) {
    console.log('You must log in!');

    var loginController = this.controllerFor('signin');
    loginController.set('attemptedTransition', transition);
    this.transitionTo('signin');
  },

  isValidToken: function() {

    var result = false;
    var curToken = this.controllerFor('application').get('token');

    $.ajax({
        url: "http://localhost:8090/RememberMe/api/validate",
        type: "POST",
        headers: { 
         'X-Auth-Token': curToken
        },
        data: JSON.stringify({}),
        async: false
    }).then(function(response) {
        result = curToken == response.token;
    });

    return result;
  }
});