
Template.dash.total = function(){
  var total = 0;
  Expenses.find().map(function(doc){
    total += doc.ammount;
  });
  return total;
};
Template.dash.me = function(){
  var total = 0;
  Expenses.find().map(function(doc){
    if (doc.payer === Meteor.userId()) {
      total -= doc.ammount;
    }
    if (doc.owers.indexOf(Meteor.userId()) != -1){
      total += doc.ammount / doc.owers.length;
    }
  });
  return total;
};

Template.dash.getOwes = function(){
  var result = {};
  Expenses.find({owers : Meteor.userId()}).map(function (doc) {
    result[doc.payer] = (result[doc.payer]|0) - (doc.ammount / doc.owers.length);
  });
  Expenses.find({payer: Meteor.userId()}).map(function (doc) {
    doc.owers.forEach(function(ower){
      result[ower] = (result[ower]) + (doc.ammount / doc.owers.length);
    });
  })
  var objs = [];
  for(var id in result){
    if (result[id]){
        objs.push({user: id, ammount: result[id]});
      }
  }
  return objs;
}