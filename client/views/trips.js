Template.trips.userTrips = function(){
  return Trips.find({members:Meteor.userId()});
};
Template.trips.events({
  'click .tripCard' : function(e){
    Session.set('currentTrip',e.target.dataset.id);
    e.preventDefault();
  }
});
