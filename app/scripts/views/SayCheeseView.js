RemembermeWeb.SayCheeseView = Em.View.extend({
  didInsertElement : function(){
    this._super();
    
    var webcam = new SayCheese('#webcam-container');
 
    webcam.on('start', function() {
      $('#snap')
        .attr('disabled', false)
        .on('click', function() {
          console.log("snapshot!");
          webcam.video.pause();
          return webcam.takeSnapshot();
        });
    });

    webcam.on('snapshot', function(snapshot) {
      var req  = new XMLHttpRequest(),
          img  = snapshot.toDataURL('image/jpeg').split(',')[1];
   
      req.open('POST', 'http://localhost:8090/RememberMe/uploadPhoto');
   
      req.onload = function(evt) {
        var url = this.response,
            img = document.createElement('img');
     
        img.onload = function() {
          webcam.video.play();
          return $('#results').prepend(this);
        }
     
        img.src = url;
      };
 
      var data = new FormData();
      data.append('img', img);
      req.send(data);
    });
   
    webcam.start();


    // Ember.run.scheduleOnce('afterRender', this, function(){
    //   Dropzone.discover();
    // });
  }
});