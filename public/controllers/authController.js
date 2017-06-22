ydyApp.controller('authController', function ($scope, $rootScope, $location, $http, authService) {

    // Store details populated by user in input fields
    $scope.user = {
        email: '',
        name: '',
        password: '',
        password2: '',
    }

    // Login method
    $scope.login = function () {
        // Perform client-side validation
        if ($scope.validateForm('login')) {
            authService.login($scope.user);
        }
    }

    // Register method
    $scope.register = function () {
        // Perform client-side validation
        if ($scope.validateForm('register')) {
            authService.register($scope.user);
        }
    }

    // Login as guest
    $scope.guestLogin = function () {
        let user = {
            email: 'peter.parker@email.com',
            password: 'spiderman',
        }

        // Send guest login details to server
        authService.login(user)
    }

    // Check for authService error message
    $scope.hasError = function () {
        return authService.error.message !== ''
    }

    // Get authService error message
    $scope.getError = function () {
        return authService.error.message;
    }

    // Validate email
    $scope.isValidEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    // Validate form
    $scope.validateForm = function (form) {

        // Empty email
        if ($scope.user.email == '') {
            authService.error.message = 'An email address is required.';
            return false;
        }

        // Empty password
        if ($scope.user.password == '') {
            authService.error.message = 'A password is required.';
            return false;
        }

        // Empty password 2
        if (form === 'register' && $scope.user.password2 == '') {
            authService.error.message = 'Please populate both password fields.';
            return false;
        }

        // Empty name
        if (form === 'register' && $scope.user.name == '') {
            authService.error.message = 'A name is required.';
            return false;
        }

        // Invalid Email
        if (!$scope.isValidEmail($scope.user.email)) {
            authService.error.message = 'Please enter a valid email address';
            return false;
        }

        return true;
    }


    // Store status of different authentication forms
    $scope.authForm = {
        login: true,
        signup: false
    }

    // Switch between authentication forms
    $scope.toggleAuthForm = function (form) {

        // Wipe any error messages
        authService.error.message = '';

        if (form === 'login') {
            $scope.authForm.login = true;
            $scope.authForm.signup = false;
        } else if (form === 'signup') {
            $scope.authForm.login = false;
            $scope.authForm.signup = true;
        }
    }
});