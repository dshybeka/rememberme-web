RemembermeWeb.SigninController = Ember.Controller.extend({

  actions: {
      login: function() {
          var data = {
              email: this.get('email'),
              password: this.get('password')
          };
          Ember.$.post('http://localhost:8090/RememberMe/api/login', data).then(function(response) {
              console.log("response " + response);
          });
      }
  }
})