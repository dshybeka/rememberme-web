RemembermeWeb.MyFriendsRoute = RemembermeWeb.AuthentificatedRoute.extend({

  setupController: function(controller, context) {

    var photos = [];

    var applicationController = window.RemembermeWeb.__container__.lookup('controller:application');

    $.ajax({
        url: "http://localhost:8090/RememberMe/user/" + applicationController.userId +"/photo",
        type: "GET",
        async: false
    }).then(function(response) {

        if (response.success) {
          console.log("success");
          controller.set('photoDetails', response.photoDetails);
          controller.set('userId', applicationController.userId);
        } else {
          console.log("unsuccess");
          controller.set('errorMessage', "Sorry, no photos found =(");
        }
    }, function() {
      console.log("error!");
      controller.set('errorMessage', "Wrong email or password");
    });

    controller.set("photos", photos);
  }
});