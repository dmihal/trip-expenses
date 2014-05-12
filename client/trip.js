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
