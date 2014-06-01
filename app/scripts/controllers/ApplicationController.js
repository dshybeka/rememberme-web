RemembermeWeb.ApplicationController = Ember.Controller.extend({

  token: localStorage.token == null ? "" : localStorage.token,
  tokenChanged: function() {
    localStorage.token = this.get('token');
  }.observes('token'),

  actions: {
      logout: function() {
        console.log('logout!');

        $.ajax({
            url: "http://localhost:8090/RememberMe/api/logout",
            type: "POST",
            headers: { 
             'X-Auth-Token': this.token
            },
            data: JSON.stringify({}),
            async: false
        }).then(function(response) {
            console.log("Session ended!");
        });
        
        localStorage.clear();
        this.set('token', "");

        this.transitionToRoute('index');
      }
  }
})