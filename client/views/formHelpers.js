Template.checkboxUsers.created = function(){
	this.id = this.data._id;
}
Template.checkboxUsers.rendered = function(){
	if(this.id){
		var owers = Expenses.findOne(this.id).owers;
		this.findAll('input').forEach(function(box){
			if (owers.indexOf(box.value)!=-1) {
				box.checked = true;
			} else {
				box.checked = false;
			}
		});
	}
}
Template.checkboxUsers.users = function(){
	return Meteor.users.find();
}
Template.checkboxUsers.isChecked = function(hash,context){
	return !this.owers || (this.owers.indexOf(id) != -1);
}
