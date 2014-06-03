RemembermeWeb.PhotoDetailsController = Ember.Controller.extend({

  needs: ["application"],
  
  actions: {
    savePhotoDetails: function() {

      var self = this;

      self.set('errorMessage', null);
      $.ajax({
        url: "http://localhost:8090/RememberMe/user/" + self.get('model').userId +"/photo/" + self.get('model').id + "/details",
        type: "PUT",
        data: JSON.stringify(self.get('model')),
        async: false
      }).then(function(response) {

          if (response.success) {
            console.log("success");

          } else {
            console.log("unsuccess");
            self.set('errorMessage', "Sorry, could not update photo =( try later!");
          }
      }, function() {
        console.log("error!");
        self.set('errorMessage', "Sorry, some problems while updating this image");
      });
    },

    processPhoto: function() {

      var self = this;

      self.set('errorMessage', null);
      $.ajax({
        url: "http://localhost:8090/RememberMe/user/" + self.get('model').userId +"/photo/" + self.get('model').id + "/process",
        type: "POST",
        data: JSON.stringify(self.get('model')),
        async: false
      }).then(function(response) {

          if (response.success) {
            console.log("success");

          } else {
            console.log("unsuccess");
            self.set('errorMessage', "Sorry, could not update photo =( try later!");
          }
      }, function() {
        console.log("error!");
        self.set('errorMessage', "Sorry, some problems while updating this image");
      });
    }
  }
})