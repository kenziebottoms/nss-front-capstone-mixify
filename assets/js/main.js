"use strict";

const angular = require("angular");
const ngRoute = require("angular-route");

let myApp = angular.module("mixtape", [ngRoute]);

require("./router.js");
require("./constants.js");

require("./ctrl/menu");
require("./ctrl/user");
require("./ctrl/home");
require("./ctrl/search");
require("./ctrl/profile");
require("./ctrl/media");
require("./ctrl/movie");
require("./ctrl/tv");
require("./ctrl/book");
require("./ctrl/link");
require("./ctrl/track");
require("./ctrl/playlist");

require("./factory/spotify/auth");
require("./factory/spotify/track");
require("./factory/spotify/playlist");
require("./factory/firebase");
require("./factory/link");
require("./factory/tmdb");
require("./factory/goodreads");