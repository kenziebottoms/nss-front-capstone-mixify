"use strict";

angular.module("mixtape").factory("SpotifyAuthFactory", function($q, $http, SPOTIFY, FirebaseFactory) {
    // asks spotify for user info using the current token
    // receives:    token
    // returns:     promise of userData
    const fetchUserInfo = token => {
        return $q((resolve, reject) => {
            $http({
                method: "GET",
                url: `${SPOTIFY.url}/me`,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(({data}) => {
                    cacheUserData(data);
                    resolve(data);
                })
                .catch(err => reject(err));
        });
    };

    // retrieves active token and checks that it's still valid
    // receieves:   nothing
    // returns:     token | false
    const getActiveToken = () => {
        let token = localStorage.getItem("spotifyUserToken");
        let expiration = localStorage.getItem("spotifyTokenExpiration");
        if (expiration < parseInt(Date.now()/1000)) {
            logout();
            return false;
        } else {
            return token;
        }
    };

    // stores user token and its expiration date in localStorage
    // receives:    user token, maximum age thereof in seconds
    // returns:     nothing
    const setActiveToken = (token, expires_in) => {
        localStorage.setItem("spotifyUserToken", token);
        // Date.now() returns epoch in milliseconds, we want seconds
        let timeStamp = parseInt(Date.now()/1000);
        localStorage.setItem("spotifyTokenExpiration", (+timeStamp) + (+expires_in));
    };

    // parses spotify callback hash and logs user in
    // receives:    spotify callback hash
    // returns:     nothing
    const login = hash => {
        let hashes = hash.split(/[?&]/);
        let token = hashes[0].split(/=/)[1];
        let expires_in = hashes[2].split(/=/)[1];
        setActiveToken(token, expires_in);
        return getActiveUserData();
    };
    // removes all localStorage variables related to the user
    // recieves:    nothing
    // returns:     nothing
    const logout = () => {
        localStorage.removeItem("spotifyUserToken");
        localStorage.removeItem("spotifyTokenExpiration");
        localStorage.removeItem("spotifyUserInfo");
    };

    const getUserData = username => {
        return $q((resolve, reject) => {
            let token = getActiveToken();
            $http({
                method: "GET",
                url: `${SPOTIFY.url}/users/${username}`,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    const cacheUserData = data => {
        data.username = data.uri.split(":")[2];
        localStorage.setItem("spotifyUserInfo", JSON.stringify(data));
        FirebaseFactory.storeUserData(data.username, data);
    };
    const getActiveUserData = () => {
        return $q((resolve, reject) => {
            let userData = localStorage.getItem("spotifyUserInfo");
            let token = getActiveToken();
            if (userData) {
                resolve(JSON.parse(userData));
            } else if (token) {
                resolve(fetchUserInfo(token));
            } else {
                reject("No active user");
            }
        });
    };

    return { login, logout, getActiveToken, getActiveUserData, getUserData };

});