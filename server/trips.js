Meteor.methods({
  isValidTrip: function (name) {
    check(name, String);

    var query = Trips.find({name:name});

    return (query.count() == 1) ? query.fetch()[0]._id : false;
  }
});

Meteor.publish("tripAssets", function (tripId) {
  if (this.userId !== null) {
  	var trip = Trips.find({_id:tripId, members:this.userId}, {fields: {code: 0}});
  	if (trip.count() == 0) {
  		return;
  	}
    return [
      trip,
      Expenses.find({trip:tripId}),
      Meteor.users.find({_id : {$in : trip.fetch()[0].members}})
    ];
  }
});
