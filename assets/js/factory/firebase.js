"use strict";

angular.module("mixtape").factory("FirebaseFactory", function($q, $http, FIREBASE) {
    
    // returns a list of $limit media items of given type
    let getMediaByType = (type, limit) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/media.json?orderBy="type"&equalTo="${type}"&limitToFirst=${limit}`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    // returns a piece of media by the given type and id
    let getMediaByTypeId = typeId => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/media/${typeId}.json`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    // returns details of track with given id
    let getTrackById = id => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/tracks/${id}.json`)
                .then(({data}) => {
                    data.id = id;
                    resolve(data);
                });
        });
    };

    // stores data about the current active user in Firebase
    const storeUserData = (username, data) => {
        return $q((resolve, reject) => {
            $http.put(`${FIREBASE.dbUrl}/users/${username}.json`, data)
                .then(response => resolve(response));
        });
    };

    // gets data about the given user
    const getUserData = username => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/users/${username}.json`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    // gets the display_name of the given user
    const getDisplayName = username => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/users/${username}/display_name.json`)
                .then(({data}) => resolve(data));
        });
    };

    // stores data in Firebase under typeId
    const storeMedia = (typeId, data) => {
        return $q((resolve, reject) => {
            data.type = typeId.split(":")[0];
            data.last_cached = parseInt(Date.now()/1000);
            $http.put(`${FIREBASE.dbUrl}/media/${typeId}.json`, data)
                .then(response => {
                    resolve(response);
                })
                .catch(err => reject(err));
        });
    };

    // updates Firebase data if it's more than 24h old
    const cacheMedia = (typeId, data) => {
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

    // stores data in Firebase under typeId
    const storeMusic = (typeId, data) => {
        return $q((resolve, reject) => {
            if (typeId.split(":")[0] == "track") {
                data.last_cached = parseInt(Date.now()/1000);
                $http.put(`${FIREBASE.dbUrl}/tracks/${typeId.split(":")[1]}.json`, data)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(err => reject(err));
            } else if (typeId.split(":")[0] == "playlist") {
                data.last_cached = parseInt(Date.now()/1000);
                $http.put(`${FIREBASE.dbUrl}/playlists/${typeId.split(":")[1]}:${typeId.split(":")[2]}.json`, data)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(err => reject(err));
            }
        });
    };

    // gets playlist by user id and playlist id
    let getPlaylistByIds = (uid, playlistId) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/playlists/${uid}:${playlistId}.json`)
                .then(({data}) => resolve(data));
        });
    };

    return {getMediaByType, getMediaByTypeId, getTrackById, storeUserData, getUserData, getDisplayName, storeMedia, cacheMedia, storeMusic, getPlaylistByIds};
});