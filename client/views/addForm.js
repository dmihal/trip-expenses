Template.addForm.users = function () {
  var trip = Trips.findOne(Session.get('currentTrip'));
  return Meteor.users.find({_id : {$in : trip.members}});
}
Template.addForm.events({
  'click #addbtn' : function(){
    var ammount = +($("#ammountField").val()) || 0;
    var payer = $("#paidField input:checked").val();
    var owers = [];
    $("#owesField input:checked").each(function(){
      owers.push(this.value);
    });
    var note = $("#noteField").val();
    if ((ammount<=0) || !payer || !owers.length) {
      alert('Complete all the fields');
      return false;
    }

    Expenses.insert({
      owner : Meteor.userId(),
      payer : payer,
      owers : owers,
      ammount: ammount,
      note : note,
      trip : Session.get('currentTrip'), 
      date : new Date()
    });
    $("#addForm").val('');
  }
});
Template.addForm.isMe = function(){
  return this._id === Meteor.user()._id;
}
