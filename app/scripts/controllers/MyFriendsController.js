RemembermeWeb.MyFriendsController = Ember.Controller.extend({

  actions: {
    showPhotoDetails: function(photoDetail) {
      console.log("photoDetail " + photoDetail.id);
      this.transitionToRoute('photoDetails');  
    }
  }
})