RemembermeWeb.MyFriendsController = Ember.Controller.extend({

  needs: ["photoDetails"],

  actions: {
    showPhotoDetails: function(photoDetails) {

      var updatedPhotoDetails = photoDetails;

      console.log("photoDetail " + photoDetails.id);

      $.ajax({
        url: "http://localhost:8090/RememberMe/user/" + photoDetails.userId +"/photo/" + photoDetails.photoId + "/details",
        type: "GET",
        async: false
      }).then(function(response) {

            if (response.success) {
              updatedPhotoDetails = response.data;
            } else {
              console.log("unsuccess");
            }
      }, function() {
          console.log("error!");
      });

      var photoDetailsController = this.get('controllers.photoDetails');
      photoDetailsController.set('model', updatedPhotoDetails)

      this.transitionToRoute('photoDetails', {photoId: photoDetails.id});  
    }
  }
})