var app = angular.module('socialcop', ['firebase']);

app.constant('FIREBASE_URI', 'https://socialcop-9ca16.firebaseio.com/');

app.controller('MainCtrl', function (ThiefsService) {
    var main = this;
    main.newThief = {lane: '', name: '', score: ''};
    main.currentThief = null;
    main.thiefs = ThiefsService.getThiefs();

    // Add, Update and Remove operations

    main.addThief = function () {
        ThiefsService.addThief(angular.copy(main.newThief));
        main.newThief = {lane: main.newThief.lane, name: main.newThief.name, score: main.newThief.score};
    };

    main.updateThief = function (thief) {
        ThiefsService.updateThief(thief);
    };

    main.removeThief = function (thief) {
        ThiefsService.removeThief(thief);
    };

});

// Array containing unique id's of the subscribed thieves' for notifications
subscriptions = [];

// This flag represents the status of 'Track all thieves' checkbox at the home page (False initially)
subscribe_all_flag = false;

// Controller for 'Track all thieves' checkbox
app.controller('AllNotificationsController', ['$scope', function($scope, FIREBASE_URI) {
     
     $scope.subscribe_all_checkbox = {
       value : "Selected",
     };
     $scope.toggle_notifications_mode = function() {
        subscribe_all_flag = !subscribe_all_flag;
     }     
 }])

app.controller('SubscriptionController', ['$scope', function($scope, FIREBASE_URI) {
    
    // Flag to prevent triggering of push notifications on page load.
    var newItems = false;

    var ref = new Firebase('https://socialcop-9ca16.firebaseio.com/');
   
    // Retrieve new posts as they are added or modified in our database

    ref.limitToLast(1).on("child_added", function(snapshot, prevChildKey) {
        if (!newItems) return;
        var newPost = snapshot.val();
        if(subscribe_all_flag) {
        	var msg = "Alert! New thief reported at " + newPost.lane
        	notifyUser(msg);
        	console.log(msg);
    	}
    });

    ref.on("child_changed", function(snapshot, prevChildKey) {
    var newPost = snapshot.val();
    console.log(subscriptions.indexOf(snapshot.key()));
    if(subscribe_all_flag || subscriptions.indexOf(snapshot.key())>=0){
    	var msg = "Thief "+ newPost.name + " was seen in Vehicle No. " + newPost.score + " at " + newPost.lane;
        notifyUser(msg);
        console.log(msg);
    }
    });

    ref.on("child_removed", function(snapshot, prevChildKey) {
	    if(subscribe_all_flag || subscriptions.indexOf(snapshot.key())>=0){
		    var newPost = snapshot.val();
		    var msg = "Congrats fellow Cop! " + newPost.name + " was caught";
		    notifyUser(msg);
		    console.log(msg);
	    }});    
	    ref.once('value', function(messages) {
	    newItems = true;
	});

    $scope.subscribe_thief_notifications = function(id,status) {
        if(status == "Subscribed"){
            subscriptions.push(id);
            console.log(subscriptions)
        }
        else    {
            var index = subscriptions.indexOf(id);
            if (index !== -1) {
                subscriptions.splice($scope.subscriptions, 1);
                console.log(subscriptions)
            }
        }
    }        
}]);


// Service for thieve's data

app.service('ThiefsService', function ($firebaseArray, FIREBASE_URI) {
    var service = this;
    var ref = new Firebase(FIREBASE_URI);
    var thiefs = $firebaseArray(ref);

    service.getThiefs = function () {
        return thiefs;
    };

    service.addThief = function (thief) {
        thiefs.$add(thief);
    };

    service.updateThief = function (thief) {
        thiefs.$save(thief);
    };

    service.removeThief = function (thief) {
        thiefs.$remove(thief);
        var index = subscriptions.indexOf(thief.$id);
            if (index !== -1) {
                subscriptions.splice($scope.subscriptions, 1);
            }
    };
});


// Handling Notifications

function obtainNotificationPermission(){
	
	if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
    return false;
  }

  else if (Notification.permission === "granted") {
     return true;
  }

  // Otherwise, we need to ask the user for permission
  else {

    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        console.log("Permission granted");
        return true;
      }
      else if(Notification.permission ==="denied") {
      	alert("You won't be able to subscribe to push notifications from the database until you give permission for notifications.")
      	return false;
      }
    });
  }
}


function notifyUser(message) {

  if (obtainNotificationPermission()) {
    var notification = new Notification(message);
  }
}


// Obtain Notification Permission on page load

obtainNotificationPermission();