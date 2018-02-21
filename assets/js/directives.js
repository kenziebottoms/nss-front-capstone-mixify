"use strict";

const angular = require("angular");

// reference: https://stackoverflow.com/questions/17470790/how-to-use-a-keypress-event-in-angularjs
angular.module("mixtape").directive("ngEnter", function () {
    return {
        controller: "MixCtrl",
        link: function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        }
    };
});