"use strict";

const angular = require("angular");

angular.module("mixtape").controller("TvCtrl", function($scope, $q, $controller, TmdbFactory, FirebaseFactory) {

    // gets link loading methods from MediaCtrl
    $controller("MediaCtrl", {$scope: $scope});    

    // gets show details straight from TMDb
    $scope.fetchInfo = (typeId) => {
        return $q((resolve, reject) => {
            TmdbFactory.getTvShowById($scope.id)
                .then(show => {
                    // clean up data for display and storage
                    show = TmdbFactory.parseApiInfo("tv", show);
                    // pass data to dom
                    $scope.media = show;
                    resolve();
                    // update cached info in firebase
                    FirebaseFactory.cacheMedia(typeId, show);
                });
        });
    };

    $scope.typeId = `tv:${$scope.id}`;
    $scope.fetchInfo($scope.typeId);

    // after links and user data have been fetched, get votes
    Promise.all([
        $scope.getLinks($scope.typeId),
        $scope.getUserData()
            .then(response => {
                $scope.isSubscribed();
            })
    ])
        .then(results => {
            $scope.getVotes();
        });
});