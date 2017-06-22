// Authentication service
ydyApp.service('authService', function ($window, $http, $location) {

    var saveToken = function (token) {
        $window.localStorage['ydy-token'] = token;
    }

    var getToken = function () {
        return $window.localStorage['ydy-token'];
    }

    var isLoggedIn = function () {
        var token = getToken();
        var payload;

        if (token) {
            payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    var currentUser = function () {
        if (isLoggedIn()) {
            var token = getToken();
            var payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            return {
                email: payload.email,
                name: payload.name,
                _id: payload._id,
                settings: payload.settings
            };
        }
    };

    var error = {
        message: ''
    }

    var login = function (user) {

        $http.post('/auth/login', user)
            .then(
                // Http success
                function successCallback(response) {
                    // Http success does not necessarily mean request was successful
                    var success = response.data.success;

                    // If request was successful
                    if (success) {
                        // Save JSON web token
                        saveToken(response.data.token);

                        // Redirect to todos page
                        $location.path('/todos');
                        error.message = '';
                    } else {
                        // Display error message
                        error.message = response.data.message;
                    }
                },
                // Http failure
                function errorCallback(response) {
                    error.message = response.data.message;
                });
    }

    var register = function (user) {
        $http.post('/auth/register', user)
            .then(
                // Http success
                function successCallback(response) {

                    // Check if request was actually successful
                    var success = response.data.success;
                    if (success) {
                        // Save JSON web token
                        saveToken(response.data.token);

                        // Redirect to todos page
                        $location.path('/todos');
                        error.message = '';
                    } else {
                        error.message = response.data.message;
                    }
                },
                // Http failure
                function errorCallback(response) {
                    error.message = response.data.message;
                });
    }

    var logout = function () {
        var user = currentUser();
        config = {
            method: "GET",
            url: "/auth/logout",
            params: {
                sample: false
            }
        }

        // Indicate logging out from sample account
        if (user.email === 'peter.parker@email.com') {
            config.params.sample = true;
        }

        $http(config)
            .then(function () {
                    // Remove JSON web token
                    $window.localStorage.removeItem('ydy-token');
                    $location.path('/');
                    error.message = '';
                },
                function () {
                    console.error('Logout failed.');
                })

    }

    return {
        saveToken: saveToken,
        getToken: getToken,
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        register: register,
        login: login,
        logout: logout,
        error: error
    }
});

// HTTP Request resource
ydyApp.factory('restFactory', function ($http, $rootScope, $resource, authService) {


    var factory = {}


    // Method returns resource object
    factory.getResource = function () {

        return $resource(
            // URL
            '/api/user/:user_id/todos/:todo_id',
            // Default params
            { user_id: authService.currentUser()._id },
            // Additional actions
            {
                'update': {
                    method: 'PUT'
                }
            }
        );

    }

    return factory
});