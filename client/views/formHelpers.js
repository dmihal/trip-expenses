Template.checkboxUsers.users = function(){
	return Meteor.users.find();
}
Template.dynamicCheckbox.isChecked=function(){
	if (!this.expense){
		return true;
	} else {
		return Expenses.findOne(this.expense).owers.indexOf(this.user._id)!==-1
	}
}
