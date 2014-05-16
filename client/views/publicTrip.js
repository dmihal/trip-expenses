Template.publicTrip.title = function(){
  return Trips.findOne(Session.get('currentTrip')).title;
};
