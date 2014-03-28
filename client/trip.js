Handlebars.registerHelper('currentTrip', function(){
  return Session.get('currentTrip');
});
