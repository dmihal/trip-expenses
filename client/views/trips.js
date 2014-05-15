Template.trips.userTrips = function(){
  return Trips.find({members:Meteor.userId()});
};
Template.trips.memberCount = function(){
  return this.members.length;
}
Template.trips.events({
  'click .tripCard' : function(e){
    var id = e.target.dataset.id;
    setTrip(id);
    e.preventDefault();
  }
});
