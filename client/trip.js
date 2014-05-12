Handlebars.registerHelper('currentTrip', function(){
  return Session.get('currentTrip');
});
if(location.pathname.length > 1){
  var trip = location.pathname.substr(1);
  Meteor.call('isValidTrip', trip, function (error, result) {
    if (result){
      Session.set('currentTrip',result);
    } else {
      history.pushState({}, "Home", '/');
    }
  });
}

var tripSubscriptions = null;
Deps.autorun(function () {
  var tripID = Session.get('currentTrip');
  if (tripID !== null){
    tripSubscriptions = Meteor.subscribe("tripAssets",tripID);
  } else {
    tripSubscriptions && tripSubscriptions.stop();
  }
});