getUsername = function(username){
  var user = Meteor.users.findOne(username);
  return (user.profile && user.profile.name) || user.username;
}
Accounts.ui.config({
  passwordSignupFields : "USERNAME_ONLY"
});

UI.registerHelper('getUsername', function(context, options){
  return getUsername(context);
});
UI.registerHelper('oweGramar',function (ammount, userid) {
  var amtStr = Math.abs(ammount).toFixed(2);
  if (userid === Meteor.userId()) {
    return ammount > 0 ?
      "You owe $" +amtStr : 
      "You're owed $" + amtStr;
  } else {
    var username = getUsername(userid);
    return ammount < 0 ?
      "You owe "+ username + " $" +amtStr : 
      username + " owes you $" + amtStr;
  }
})
