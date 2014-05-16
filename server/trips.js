Meteor.methods({
  isValidTrip: function (name) {
    check(name, String);

    var query = Trips.find({name:name});

    return (query.count() == 1) ? query.fetch()[0]._id : false;
  },
  newTrip: function(properties){
    check(properties.name, String);
    check(properties.title, String);

    //Todo: check name, title for length, characters
    if(Trips.find({name:properties.name}).count() > 0){
      return {error: "Trip named '"+properties.name+"' already exists"};
    }

    var id = Trips.insert({
      name : properties.name,
      title : properties.title,
      code : "test",
      members : [this.userId],
      creator : this.userId
    });

    return {id: id};
  },
  joinTrip: function(name, code){
    check(name, String);
    check(code, String);
    if(!this.userId){
      return {error: "Not Logged In"};
    }

    var trip = Trips.findOne({name:name});
    if (!trip){
      return {error: "Trip not found"};
    }
    if (trip.members.indexOf(this.userId) != -1){
      return {error: "Already a member of this group"};
    }
    if (trip.code === code){
      Trips.update(trip._id, {$push: {members: this.userId}});
      return {id: trip._id};
    } else {
      return {error: "Incorrect passphrase"};
    }
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
