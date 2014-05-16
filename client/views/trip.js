
Template.trip.events({
  'click #backBtn' : function(e){
    e.preventDefault();
    setTrip(null);
  }
});

Template.trip.getOwes = function(){
  var result = {};
  // For each expense where I owe money...
  Expenses.find({trip:Session.get('currentTrip'), owers : Meteor.userId()}).map(function (doc) {
    // ...subtract my share of the expense
    result[doc.payer] = (result[doc.payer]||0) - (doc.ammount / doc.owers.length);
  });
  // For each expense where I paid...
  Expenses.find({trip:Session.get('currentTrip'), payer: Meteor.userId()}).map(function (doc) {
    // ...and for each person that is splitting the cost...
    doc.owers.forEach(function(ower){
      // ...add their share of the expense
      result[ower] = (result[ower]||0) + (doc.ammount / doc.owers.length);
    });
  });
  
  var objs = [];
  for(var id in result){
    if (result[id]){
        objs.push({user: id, ammount: result[id]});
      }
  }
  return objs;
}