var app = angular.module('leaderboard', ['firebase']);

app.constant('FIREBASE_URI', 'https://socialcop-9ca16.firebaseio.com/');

app.controller('MainCtrl', function (ContestantsService) {
    var main = this;
    main.newContestant = {lane: '', name: '', score: ''};
    main.currentContestant = null;
    main.contestants = ContestantsService.getContestants();

    main.addContestant = function () {
        ContestantsService.addContestant(angular.copy(main.newContestant));
        main.newContestant = {lane: main.newContestant.lane, name: main.newContestant.name, score: main.newContestant.score};
    };

    main.updateContestant = function (contestant) {
        ContestantsService.updateContestant(contestant);
    };

    main.removeContestant = function (contestant) {
        ContestantsService.removeContestant(contestant);
    };

    main.incrementScore = function () {
        main.currentContestant.score = parseInt(main.currentContestant.score, 10) + 1;
        main.updateContestant(main.currentContestant);
    };

    main.decrementScore = function () {
        main.currentContestant.score = parseInt(main.currentContestant.score, 10) - 1;
        main.updateContestant(main.currentContestant);
    };
});

subscriptions = [];
subscribe_all_flag = false;

app.controller('AllNotificationsController', ['$scope', function($scope, FIREBASE_URI) {
      $scope.subscribe_all_checkbox = {
       value : "Selected",
     };

     $scope.toggle_notifications_mode = function() {
        subscribe_all_flag = !subscribe_all_flag;
     }     
 }])

app.controller('SubscriptionController', ['$scope', function($scope, FIREBASE_URI) {
    

    var newItems = false;

    var ref = new Firebase('https://socialcop-9ca16.firebaseio.com/');
   
    // Retrieve new posts as they are added or modified in our database
    
    ref.limitToLast(1).on("child_added", function(snapshot, prevChildKey) {
        if (!newItems) return;
        var newPost = snapshot.val();
        console.log(newPost)
        if(subscribe_all_flag)
        notifyUser("Alert new Thief reported at " + newPost.lane);
        console.log("child_added")
    });
    ref.on("child_changed", function(snapshot, prevChildKey) {
    var newPost = snapshot.val();
    console.log(subscribe_all_flag);
    console.log(subscriptions.indexOf(snapshot.key()));
    if(subscribe_all_flag || subscriptions.indexOf(snapshot.key())>=0){
        notifyUser("Thief "+ newPost.name + " was seen in Vehicle No. " + newPost.score + " at " + location);
    }
    });
    ref.on("child_removed", function(snapshot, prevChildKey) {
     if(subscribe_all_flag || subscriptions.indexOf(snapshot.key())>=0){
    var newPost = snapshot.val();
    notifyUser("Congrats fellow Cop! " + newPost.name + " was caught");
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



app.service('ContestantsService', function ($firebaseArray, FIREBASE_URI) {
    var service = this;
    var ref = new Firebase(FIREBASE_URI);
    var contestants = $firebaseArray(ref);

    service.getContestants = function () {
        return contestants;
    };

    service.addContestant = function (contestant) {
        contestants.$add(contestant);
    };

    service.updateContestant = function (contestant) {
        contestants.$save(contestant);
    };

    service.removeContestant = function (contestant) {
        contestants.$remove(contestant);
        var index = subscriptions.indexOf(contestant.$id);
            if (index !== -1) {
                subscriptions.splice($scope.subscriptions, 1);
                console.log(subscriptions)
            }
    };
});

function notifyUser(message) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(message);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(message);
      }
    });
  }
}