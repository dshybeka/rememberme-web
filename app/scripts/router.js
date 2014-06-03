RemembermeWeb.Router.map(function () {

  this.resource('index', { path : '/' });

  this.resource('selectMain', { path : '/selectMain' });

  this.resource('myFriends', { path : '/myFriends' });

  this.resource('photoDetails', { path : '/myFriends/photoDetails/:photoId' });

  this.resource('uploadFile', { path : '/uploadFile' });

  this.resource('sayCheese', { path : '/sayCheese' });

  this.resource('registration', { path : '/registration' });

  this.resource('signin', { path : '/signin' });
});
