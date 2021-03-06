"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MovieCtrl", function($scope, $q, $controller, TmdbFactory, FirebaseFactory) {
    
    // gets link loading methods from MediaCtrl
    $controller("MediaCtrl", {$scope: $scope});
    
    // get movie details straight from TMDb
    $scope.fetchInfo = () => {
        return $q((resolve, reject) => {
            $scope.media = null;
            TmdbFactory.getMovieById($scope.id)
                .then(data => {
                    // clean up data for display and storage
                    let movie = TmdbFactory.parseApiInfo("movie", data);
                    $scope.media = movie;
                    $scope.media.summary = data.overview;
                    resolve();
                    // update cached info in Firebase
                    FirebaseFactory.cacheMedia($scope.typeId, movie);
                });
        });
    };
        
    $scope.fetchInfo($scope.typeId);
    $scope.typeId = `movie:${$scope.id}`;
    
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