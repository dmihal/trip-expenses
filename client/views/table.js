Session.setDefault('showAll',true);

Template.table.allexpenses = function(){
  return Session.get('showAll') ? 
    Expenses.find({trip:Session.get('currentTrip')} ) :
    Expenses.find({trip:Session.get('currentTrip'), $or: [{payer: Meteor.userId()}, {owers: Meteor.userId()}]});
};
Template.table.showAll = function(){
  return Session.get('showAll');
}
Template.table.events({
  'click #showMore' : function(e){
    Session.set('showAll',true);
    e.preventDefault();
  },
  'click #showLess' : function(e){
    Session.set('showAll',false);
    e.preventDefault();
  }
});

Template.expenseRow.owersList = function(){
  var usernames = this.owers.map(getUsername);
  return usernames.join(', ');
};
Template.expenseRow.events({
  'click .icon-remove' : function (e) {
    Expenses.remove(this._id);
    e.preventDefault();
  }
});
