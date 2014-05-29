RemembermeWeb.UploadFileView = Em.View.extend({
  didInsertElement : function(){
    this._super();
    Dropzone.autoDiscover = false;

    Dropzone.options.filedropzone = {
        addRemoveLinks: true,
        previewsContainer: "#previews",
        url: "http://localhost:8080/remember-me/user/"
    };


    Ember.run.scheduleOnce('afterRender', this, function(){
      Dropzone.discover();
    });
  }
});