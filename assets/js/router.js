"use strict";

const angular = require("angular");
const myApp = angular.module("mixtape");

myApp.config($routeProvider => {
    $routeProvider
        .when("/", {
            templateUrl: "assets/partials/home.html",
            controller: "HomeCtrl"
        })
        .when("/user/:uid/playlist/:id", {
            templateUrl: "assets/partials/playlist.html",
            controller: "PlaylistCtrl"
        })
        .when("/user/:id", {
            templateUrl: "assets/partials/profile.html",
            controller: "ProfileCtrl"
        })
        .when("/movie/:id", {
            templateUrl: "assets/partials/media.html",
            controller: "MovieCtrl"
        })
        .when("/tv/:id", {
            templateUrl: "assets/partials/media.html",
            controller: "TvCtrl"
        })
        .when("/book/:id", {
            templateUrl: "assets/partials/media.html",
            controller: "BookCtrl"
        })
        .when("/new", {
            templateUrl: "assets/partials/mix.html",
            controller: "MixCtrl"
        })
        .when("/track/:id", {
            templateUrl: "assets/partials/track.html",
            controller: "TrackCtrl"
        })
        .when("/link/:id", {
            templateUrl: "assets/partials/mix.html",
            controller: "MixCtrl"
        });
});