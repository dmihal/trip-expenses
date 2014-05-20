Template.invitePopup.url = function () {
  return Meteor.absoluteUrl(this.name);
}
Template.invitePopup.qrcode = function(){
  var url = Meteor.absoluteUrl(this.name+'/'+this.code);
  return "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+encodeURIComponent(url);
}
