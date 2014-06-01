RemembermeWeb.RegistrationController = Ember.Controller.extend({

  actions: {
      register: function() {

          var applicationController = this.controllerFor('application');

          var self = this;
          var data = {
              username: this.get('email'),
              password: this.get('password')
          };

          self.set('errorMessage', null);
          $.ajax({
              url: "http://localhost:8090/RememberMe/api/registration",
              type: "POST",
              data: data,
              async: false
          }).then(function(response) {

              if (!response.success) {
                console.log("not sucdcess " + response.message);
                self.set('errorMessage', response.message);
              } else {
                console.log("response.token " + response.token);
                applicationController.set('token', response.token)
                self.transitionToRoute('selectMain');
              }
          }, function() {
            console.log("error!");
            self.set('errorMessage', "Wrong email or password");
          });
      }
  }
})