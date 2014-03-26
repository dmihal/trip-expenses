var totals = {};
var totalDep = new Deps.Dependency();

Template.totals.created = function(){
  Expenses.find().observe({
    added: function (doc) {
      totals[doc.payer] = (totals[doc.payer]||0) - doc.ammount;//(doc.ammount / doc.owers.length);
      doc.owers.forEach(function(ower){
        totals[ower] = (totals[ower]||0) + (doc.ammount / doc.owers.length);
      });

      totalDep.changed();
    },
    changed: function (newDoc, oldDoc){
      oldDoc.owers.forEach(function(ower){
        totals[ower] = (totals[ower]||0) - (oldDoc.ammount / oldDoc.owers.length);
      });
      newDoc.owers.forEach(function(ower){
        totals[ower] = (totals[ower]||0) + (newDoc.ammount / newDoc.owers.length);
      });

      totalDep.changed();
    },
    removed: function (doc) {
      totals[doc.payer] = (totals[doc.payer]||0) + doc.ammount;//(doc.ammount / doc.owers.length);
      doc.owers.forEach(function(ower){
        totals[ower] = (totals[ower]||0) - (doc.ammount / doc.owers.length);
      });

      totalDep.changed();
    }
  });
}

Template.totals.users = function(){
  return Meteor.users.find();
}

Template.totalRow.total = function(){
  totalDep.depend();
  var total = totals[this._id]||0;
  if (total==0) {
    return '$0.00';
  } else if(total>0){
    return 'Owes $'+total.toFixed(2);
  } else {
    return 'Owed $'+(total*-1).toFixed(2);
  }
}
Template.totalRow.class = function(){
  return totals[this._id] > 0 ? 'error' : '';
}
