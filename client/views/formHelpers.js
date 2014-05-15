Template.checkboxUsers.users = function(){
	var trip = Trips.findOne(Session.get('currentTrip'));
	return Meteor.users.find({_id : {$in : trip.members}});
}
Template.dynamicCheckbox.isChecked=function(){
	if (!this.expense){
		return true;
	} else {
		return Expenses.findOne(this.expense).owers.indexOf(this.user._id)!==-1
	}
}
