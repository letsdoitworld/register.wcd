Template.login.onRendered(function (){
	
	$('.ui.dropdown').dropdown();
  Session.set('error', '');

  AllGeo.getLocationByNavigator(function(loc){

    Meteor.call('geocode', loc, (error, result) => {

      let countryCode = result[0].countryCode;
      countryCode = countryCode.toLowerCase();

      $('.ui.dropdown').dropdown('set selected', countryCode);
    });    
  });

	$('.register').form({
	    on: 'blur',
	    fields: {
	      empty: {
	        identifier  : 'empty',
	        rules: [
	          {
	            type   : 'empty',
	            prompt : 'Please enter a value'
	          }
	        ]
	      },
	      dropdown: {
	        identifier  : 'dropdown',
	        rules: [
	          {
	            type   : 'empty',
	            prompt : 'Please select a dropdown value'
	          }
	        ]
	      },
	    }
	  });
});

Template.login.helpers({
  error () {

    error = Session.get('error');
    if(error)
      return error;
    else
      return false;
  },
});

Template.login.events({
  'submit .register'(event) {

    event.preventDefault();
    const country = event.target.country;
    const email = event.target.email;
    const phone = event.target.phone;

    if (!phone.value && !email.value) {

      Session.set('error', 'Please provide at least one contact method');
    } else {

      //FlowRouter.go("/register");
    }
    
    if (phone.value) {

      let userPhone = phone.value;
      Accounts.createUserWithPhone({
        phone: userPhone,
        profile: {
          name: 'My friend',
          phone: userPhone,
        }
      }, () => {

        Meteor.setTimeout(() => {
          FlowRouter.go("/register");
        }, 500);

        Session.set("error", "User registered! Redirecting..");

      });

      Session.set("error", "Thank you and welcome!");

    }

    if (email.value) {

      let otp = Math.random().toString(36).substring(7);
      let user = {
        email: email.value,
        password: otp,
      };

      Accounts.createUser(user, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');

        } else {
          Meteor.call('sendVerificationLink', ( error, response ) => {
            if (error) {

              Bert.alert( error.reason, 'danger' );

            } else {

              Bert.alert( 'Welcome!', 'success' );
            }
          });
        }
      });

      Session.set('error', '');
    }

  },
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
  "click #login-fb": function (err, tmpl) {
    
    //analytics.track("Login Clicked");
    
    Meteor.loginWithFacebook({ 
      requestPermissions: ['email']},
      function (err) {
          if (err) {

          /*	
            analytics.track("Login failed", {
              problem: err,
              why: err.reason
            });
          */
            
          } else {
            //analytics.track("Login success");
          }

          FlowRouter.go("/register");
      });
  },
  "click #login-email": function (err, tmpl) {
    
      //analytics.track("Login Clicked");    
  },
  "click #login-phone": function (err, tmpl) {
    
      let options = {phone:'+37253073123'};
      //options.password = 'VeryHardPassword';

      Accounts.createUserWithPhone(options, function (){});
      
      /*
      // Debug: Verify the user phone isn't confirmed it.
      console.log('Phone verification status is :', Accounts.isPhoneVerified());
      var userPhone = '+37253073123';
      // Request for sms phone verification -- please note before receiving SMS you should Follow the SMS Integration tutorial below
      Accounts.requestPhoneVerification(userPhone, function(){});
      //Debug:  Verify the user phone isn't confirmed it.
      console.log('Phone verification status is :', Accounts.isPhoneVerified());

      // After receiving SMS let user enter his code and verify account by sending it to the server
      var verificationCode = 'CodeRecivedBySMS';
      var newPassword = null;
      // You can keep your old password by sending null in the password field
      Accounts.verifyPhone(userPhone, verificationCode, function(){});
      //Debug:  Verify the user phone is confirmed.
      console.log('Phone verification status is :', Accounts.isPhoneVerified());
      */
    
  },
})