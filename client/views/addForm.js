Template.addForm.users = function () {
  return Meteor.users.find();
}
Template.addForm.events({
  'click #addbtn' : function(){
    var ammount = $("#ammountField").val() | 0;
    var payer = $("#paidField input:checked").val();
    var owers = [];
    $("#owesField input:checked").each(function(){
      owers.push(this.value);
    });
    var note = $("#noteField").val();
    if (!(ammount|0) || !payer || !owers.length) {
      alert('Complete all the fields');
      return false;
    }

    Expenses.insert({
      owner : Meteor.userId(),
      payer : payer,
      owers : owers,
      ammount: ammount,
      note : note,
      date : new Date()
    });
    $("#addForm").val('');
  }
});
