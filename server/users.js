Meteor.publish("userAssets", function () {
  if (this.userId !== null) {
    return [
      Trips.find({members:this.userId}, {fields: {code: 0}})
    ];
  }
});
