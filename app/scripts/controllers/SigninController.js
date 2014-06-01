RemembermeWeb.SigninController = Ember.Controller.extend({

  actions: {
      login: function() {

          var applicationController = this.controllerFor('application');

          var self = this;
          var data = {
              username: this.get('email'),
              password: this.get('password')
          };

          self.set('errorMessage', null);
          Ember.$.post('http://localhost:8090/RememberMe/api/login', data).then(function(response) {
              

              if (response.token) {

                applicationController.set('token', response.token);

                var attemptedTransition = self.get('attemptedTransition');
                if (attemptedTransition) {

                  attemptedTransition.retry();
                  self.set('attemptedTransition', null);
                } else {

                  self.transitionToRoute('selectMain');
                }
              }
          }, function() {
            self.set('errorMessage', "Wrong email or password");
          });
      }
  },

  reset: function() {
    this.setProperties({
      email: "",
      password: "",
      errorMessage: ""
    });
  }
})