RemembermeWeb.MyFriendsController = Ember.Controller.extend({

  needs: ["photoDetails"],

  actions: {
    showPhotoDetails: function(photoDetails) {
      console.log("photoDetail " + photoDetails.id);

      var photoDetailsController = this.get('controllers.photoDetails');
      photoDetailsController.set('model', photoDetails)

      this.transitionToRoute('photoDetails', {photoId: photoDetails.id});  
    }
  }
})