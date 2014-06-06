RemembermeWeb.MyFriendsController = Ember.Controller.extend({

  needs: ["photoDetails"],

  actions: {
    showPhotoDetails: function(photoDetails) {

      var updatedPhotoDetails = photoDetails;

      console.log("photoDetail " + photoDetails.id);

      $.ajax({
        url: "http://localhost:8090/RememberMe/user/" + photoDetails.userId +"/photo/" + photoDetails.id + "/details",
        type: "GET",
        async: false
      }).then(function(response) {

            if (response.success) {
              console.log("refresh details!");
              updatedPhotoDetails = response.data;
            } else {
              console.log("unsuccess");
            }
      }, function() {
          console.log("error!");
      });

      var photoDetailsController = this.get('controllers.photoDetails');
      photoDetailsController.set('model', updatedPhotoDetails);
      this.set('model', updatedPhotoDetails);

      this.transitionToRoute('photoDetails', updatedPhotoDetails);  
    }
  }
})