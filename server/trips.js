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
Meteor.publish("tripOwes", function (tripId) {
  var self = this;
  check(tripId, String);
  var count = 0;
  var initializing = true;
  var owes = {};
  var setOwes = function(id,value){
    // If we're initializing, we'll wait until it's built before sending data
    if(!initializing){
      if (owes[id]){
        if(value < 0.01){
          self.removed("owes",id);
        } else {
          self.changed("owes",id,{ammount: value});
        }
      } else {
        self.added("owes",id,{ammount: value});
      }
    }
    owes[id] = value;
  }

  // observeChanges only returns after the initial `added` callbacks
  // have run. Until then, we don't want to send a lot of
  // `self.changed()` messages - hence tracking the
  // `initializing` state.
  var handle1 = Expenses.find({trip: tripId, owers: this.userId}).observe({
    added : function(doc){
      var ammt = (owes[doc.payer]||0) - (doc.ammount / doc.owers.length);
      setOwes(doc.payer, ammt);
    },
    changed : function(newDoc, oldDoc){
      var ammt = (owes[newDoc.payer]||0) + (oldDoc.ammount / oldDoc.owers.length) - (newDoc.ammount / newDoc.owers.length);
      setOwes(doc.payer, ammt);
    },
    removed : function(doc){
      var ammt = (owes[doc.payer]||0) + (doc.ammount / doc.owers.length);
      setOwes(doc.payer, ammt);
    }
  });
  var handle2 = Expenses.find({trip:tripId, payer: this.userId}).observe({
    added : function(doc){
      doc.owers.forEach(function(ower){
        // ...add their share of the expense
        var ammt = (owes[ower]||0) + (doc.ammount / doc.owers.length);
        setOwes(ower,ammt);
      });
    },
    changed : function(newDoc, oldDoc){
      doc.owers.forEach(function(ower){
        // ...add their share of the expense
        var ammt = (owes[ower]||0) - (oldDoc.ammount / oldDoc.owers.length) + (newDoc.ammount / newDoc.owers.length);
        setOwes(ower,ammt);
      });
    },
    removed : function(doc){
      doc.owers.forEach(function(ower){
        // ...add their share of the expense
        var ammt = (owes[ower]||0) - (doc.ammount / doc.owers.length);
        setOwes(ower,ammt);
      });
    }
  });

  // Instead, we'll send one `self.added()` message right after
  // observeChanges has returned, and mark the subscription as
  // ready.
  initializing = false;
  console.log(owes);
  for(var id in owes){
    if(owes[id]>=0.01 || owes[id]<= -0.01){
      self.added("owes",id,{ammount: owes[id]});
    }
  }
  self.ready();

  // Stop observing the cursor when client unsubs.
  // Stopping a subscription automatically takes
  // care of sending the client any removed messages.
  self.onStop(function () {
    handle1.stop();
    handle2.stop();
  });
});
