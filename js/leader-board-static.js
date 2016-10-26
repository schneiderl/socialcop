var app = angular.module('leaderboard', []);

app.controller('MainCtrl', function (ContestantsService) {
    var main = this;
    main.newContestant = {lane: '', name: '', score: ''};
    main.currentContestant = null;
    main.contestants = ContestantsService.getContestants();

    main.addContestant = function () {
        ContestantsService.addContestant(angular.copy(main.newContestant));
        main.newContestant = {lane: '', name: '', score: ''};
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

app.service('ContestantsService', function () {
    var service = this;
    var contestants = [
        {id: 1, lane: "New Delhi", name: 'Chuck', score: 'DL-25Y-420'},
        {id: 2, lane: "Taliban", name: 'Osama', score: 'POK-9211'},
        {id: 3, lane: "New York", name: 'Trump', score: 'NYC-0000'}
    ];

    service.getContestants = function () {
        return contestants;
    };

    service.addContestant = function (contestant) {
        contestant.id = new Date().getTime();
        contestants.push(contestant);
    };

    service.updateContestant = function (contestant) {
        // Already in memory
    };

    service.removeContestant = function (contestant) {
        contestants.remove(function(c) {
            return c.id === contestant.id;
        });
    };
});