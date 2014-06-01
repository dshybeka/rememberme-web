RemembermeWeb.UploadFileView = Em.View.extend({
  didInsertElement : function(){

    var applicationController = window.RemembermeWeb.__container__.lookup('controller:application');

    this._super();
    Dropzone.autoDiscover = false;

    Dropzone.options.filedropzone = {
        addRemoveLinks: true,
        previewsContainer: "#previews",
        url: "http://localhost:8090/RememberMe/user/" + applicationController.userId + "/photo"
    };


    Ember.run.scheduleOnce('afterRender', this, function(){
      Dropzone.discover();
    });
  }
});