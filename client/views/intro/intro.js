Template.intro.onCreated(function (){
	
	let self = this;
	self.autorun(() => {
		self.subscribe('intro', TAPi18n.getLanguage());
	});
});

Template.intro.helpers({
	intro () {

	    return Intro.findOne();
	},
  count () {
    
      return Meteor.users.find().count();
  },
  helloName () {

    Meteor.subscribe("current_user_data");

    /*
    analytics.identify({
      email: Meteor.user().profile.email,
      first_name: Meteor.user().profile.first_name,
      last_name: Meteor.user().profile.last_name
    });
    */

    let name = '';
    if (Meteor.user().profile)
      name = Meteor.user().profile.first_name;

    return name;
  },
});

Template.intro.events({
  "click #logout": function (err, tmpl) {
    Meteor.logout(function (err) {      
      if (err) {
        //Session.set("status", err.reason);
        //analytics.track("Logout error");
        
      } else {
        //analytics.track("Logout success");
      }
    })
  },
})