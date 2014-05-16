Template.trips.userTrips = function(){
  return Trips.find({members:Meteor.userId()});
};
Template.trips.memberCount = function(){
  return this.members.length;
}
var generatedTripName = "";
Template.trips.events({
  'click .tripCard' : function(e){
    var id = e.target.dataset.id;
    setTrip(id);
    e.preventDefault();
  },
  'click #newTrip' : function(e){
    Meteor.call('newTrip',{name:$("#tripName").val(),title:$("#tripTitle").val()},function(error, result){
      if (result.id){
        setTrip(result.id);
      } else {
        $("#newTripErr").text(result.error || "Error");
      }
    });
  },
  'click #joinTrip' : function(e){
    Meteor.call('joinTrip',$("#joinName").val(),$("#joinCode").val(),function(error, result){
      if (result.id){
        setTrip(result.id);
      } else {
        $("#joinErr").text(result.error || "Error");
      }
    });
  },
  'keypress #tripTitle, keyup #tripTitle' : function(e,template){
    var nameField = template.find("#tripName");
    if (generatedTripName === nameField.value){
      generatedTripName = e.target.value.replace(/\s+/g, '-').replace(/[^A-Za-z0-9\-]/g, '').toLowerCase();
      nameField.value = generatedTripName;
    }
  },
  'keypress #tripName' : function(e){
    var key = e.keyCode;
    if (!(key===45 || (key>=48 && key<=57) || (key>=97 && key<=122))){
      e.preventDefault();
    }
  }
});
