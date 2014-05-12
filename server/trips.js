Meteor.methods({
  isValidTrip: function (name) {
    check(name, String);

    var query = Trips.find({name:name});

    return (query.count() == 1) ? query.fetch()[0]._id : false;
  }
});
