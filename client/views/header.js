Template.header.total = function(){
  var total = 0;
  Expenses.find({trip:Session.get('currentTrip')}).map(function(doc){
    total += doc.ammount;
  });
  return total.toFixed(2);
};
Template.header.me = function(){
  var total = 0;
  Expenses.find({trip:Session.get('currentTrip')}).map(function(doc){
    if (doc.payer === Meteor.userId()) {
      total -= doc.ammount;
    }
    if (doc.owers.indexOf(Meteor.userId()) != -1){
      total += doc.ammount / doc.owers.length;
    }
  });
  return total;
};
Template.header.title = function(){
  return Trips.findOne(Session.get('currentTrip')).title;
}
