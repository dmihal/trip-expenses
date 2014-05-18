Template.publicTrip.title = function(){
  var trip = Trips.findOne(Session.get('currentTrip'));
  return trip && trip.title;
};
