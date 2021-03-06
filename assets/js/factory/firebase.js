"use strict";

const angular = require("angular");

angular.module("mixtape").factory("FirebaseFactory", function($q, $http, FIREBASE) {
    
    // promises a list of media items of given type sorted who knows how
    let getMediaByType = (type, limit) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/media.json?orderBy="type"&equalTo="${type}"&limitToFirst=${limit}`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    // promises cached info on the given piece of media
    let getMediaByTypeId = typeId => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/media/${typeId}.json`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    // promises cached info on the given track
    let getTrackById = id => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/tracks/${id}.json`)
                .then(({data}) => {
                    data.id = id;
                    resolve(data);
                });
        });
    };

    // caches data about the given active user in Firebase
    let storeUserData = (username, data) => {
        return $q((resolve, reject) => {
            $http.put(`${FIREBASE.url}/users/${username}.json`, data)
                .then(response => resolve(response));
        });
    };

    // promises cached data about the given user
    let getUserData = username => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/users/${username.replace(".",",")}.json`)
                .then(({data}) => resolve(data))
                .catch(err => {
                    Materialize.toast("No results. :(", 3000, "pink accent-2");
                });
        });
    };

    // promises the display_name of the given user
    let getDisplayName = username => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/users/${username.replace(".",",")}/display_name.json`)
                .then(({data}) => resolve(data))
                .catch(err => {
                    Materialize.toast("No results. :(", 3000, "pink accent-2");
                });
        });
    };

    // caches data in Firebase for given media item
    let storeMedia = (typeId, data) => {
        return $q((resolve, reject) => {
            data.type = typeId.split(":")[0];
            data.last_cached = parseInt(Date.now()/1000);
            $http.put(`${FIREBASE.url}/media/${typeId}.json`, data)
                .then(response => {
                    resolve(response);
                })
                .catch(err => reject(err));
        });
    };

    // updates Firebase cached info if it's more than 24h old
    let cacheMedia = (typeId, data) => {
        return $q((resolve, reject) => {
            let now = parseInt(Date.now()/1000);
            getMediaByTypeId(typeId)
            .then(media => {
                    if ((media.last_cached+86400) < now) {
                        storeMedia(typeId, data);
                    }
                });
        });
    };

    // caches info in Firebase for given music item
    let storeMusic = (typeId, data) => {
        return $q((resolve, reject) => {
            if (typeId.split(":")[0] == "track") {
                data.last_cached = parseInt(Date.now()/1000);
                $http.put(`${FIREBASE.url}/tracks/${typeId.split(":")[1]}.json`, data)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(err => reject(err));
            } else if (typeId.split(":")[0] == "playlist") {
                data.last_cached = parseInt(Date.now()/1000);
                $http.put(`${FIREBASE.url}/playlists/${typeId.split(":")[1]}:${typeId.split(":")[2]}.json`, data)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(err => reject(err));
            }
        });
    };

    // promises cached playlist info by ownerId and playlistId
    let getPlaylistByIds = (uid, playlistId) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/playlists/${uid}:${playlistId}.json`)
                .then(({data}) => resolve(data));
        });
    };

    return {getMediaByType, getMediaByTypeId, getTrackById, storeUserData, getUserData, getDisplayName, storeMedia, cacheMedia, storeMusic, getPlaylistByIds};
});