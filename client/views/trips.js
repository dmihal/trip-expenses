Template.trips.userTrips = function(){
  return Trips.find({members:Meteor.userId()});
};
Template.trips.events({
  'click .tripCard' : function(e){
  	var id = e.target.dataset.id;
    Session.set('currentTrip',id);
    history.pushState({}, "page 2", Trips.findOne(id).name);
    e.preventDefault();
  }
});
