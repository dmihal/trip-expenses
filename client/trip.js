// Global, set the currentTrip variable and push URL state
setTrip = function(tripId){
  Session.set('currentTrip',tripId);
  if(tripId){
    var trip = Trips.findOne(tripId);
    history.pushState({trip:tripId}, trip.title, trip.name);
  } else {
    history.pushState({trip:null}, "Home", "/");
  }
};

Handlebars.registerHelper('currentTrip', function(){
  return Session.get('currentTrip');
});

window.addEventListener("popstate", function (event){
  Session.set('currentTrip',event.state.trip);
});

// Read URL onLoad
if(location.pathname.length > 1){
  var trip = location.pathname.substr(1);
  Meteor.call('isValidTrip', trip, function (error, result) {
    if (result){
      Session.set('currentTrip',result);
      history.replaceState({trip:result}, "", trip);
    } else {
      history.pushState({trip:null}, "Home", '/');
    }
  });
} else {
  history.replaceState({trip:null}, "Home", "/");
}

var tripSubscriptions = null;
Deps.autorun(function () {
  var tripID = Session.get('currentTrip');
  if (tripID !== null){
    tripSubscriptions = Meteor.subscribe("tripAssets",tripID);
  } else {
    tripSubscriptions && tripSubscriptions.stop();
  }
});
