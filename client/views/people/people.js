Template.people.onCreated(function (){
	
	let self = this;
	self.autorun(() => {
		self.subscribe('allUsers');
	});
});

Template.people.onRendered(function (){
	
	let q = Meteor.users.find();
	let init = true;
	q.observeChanges({
        added: function(id, fields) {
            if(!init)
                jQuery(".usercount").animate({height: "20px"}, 150);
        }
    });
	init = false;
});

Template.people.helpers({
	people () {
		
	    return Meteor.users.find().fetch();
	},
	count () {
		
	    return Meteor.users.find().count();
	},
});