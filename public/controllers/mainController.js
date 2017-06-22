ydyApp.controller('mainController', function ($scope, $http, $window, authService) {

    // Boolean to prevent window scrolling
    $scope.windowScroll = {
        off: false
    }

    // Boolean, user logged int
    $scope.isLoggedIn = function () {
        return authService.isLoggedIn();
    }

    // Logout Function
    $scope.logout = function () {
        authService.logout();
    }

    // Array of available backgrounds
    $scope.backgrounds = [{
            thumb: 'images/backgrounds/default-thumb.jpg',
            name: 'default'
        },
        {
            thumb: 'images/backgrounds/city-thumb.jpg',
            url: 'images/backgrounds/city.jpg',
            name: 'city'
        },
        {
            thumb: 'images/backgrounds/lake-thumb.jpg',
            url: 'images/backgrounds/lake.jpg',
            name: 'lake'
        },
        {
            thumb: 'images/backgrounds/rockies-thumb.jpg',
            url: 'images/backgrounds/rockies.jpg',
            name: 'rockies'
        },
        // {
        //     thumb: 'images/backgrounds/snow-thumb.jpg',
        //     url: 'images/backgrounds/snow.jpg',
        //     name: 'snow'
        // },
        {
            thumb: 'images/backgrounds/space-thumb.jpg',
            url: 'images/backgrounds/space.jpg',
            name: 'space'
        },
        {
            thumb: 'images/backgrounds/waterfall-thumb.jpg',
            url: 'images/backgrounds/waterfall.jpg',
            name: 'waterfall'
        },
    ]

    // Object stores information about collapsable menu
    $scope.collapseMenu = {
        open: false,
        element: $('div.navbar-collapse'),
        offset: 0,
        height: 0
    }

    // Boolean indicates if background menu is open
    $scope.backgroundMenu = {
        open: false,
    }

    // Reposition background menu based on collapsable menu
    $scope.positionBackgroundMenu = function () {

        $scope.collapseMenu.offset = $($scope.collapseMenu.element).offset().top;
        $scope.collapseMenu.height = $($scope.collapseMenu.element).height();

        var backgroundMenu = $('div.user-select-background');
        $(backgroundMenu).css('top', $scope.collapseMenu.offset + $scope.collapseMenu.height + 10);

    }

    // Toggle background menu
    $scope.toggleBackgroundMenu = function () {
        $scope.positionBackgroundMenu();
        $scope.backgroundMenu.open = !$scope.backgroundMenu.open;
    }

    // Close background menu
    $scope.closeBackgroundMenu = function () { $scope.backgroundMenu.open = false; }

    // Update user account based on chosen background menu
    // Either invoked by user, or system
    $scope.updateUserBackground = function ($index, backgroundName) {

        var background = {};

        // Select specific background to use
        if ($index === null) {
            for (b of $scope.backgrounds) {
                if (b.name === backgroundName) {
                    background = b;
                    break;
                }
            }
        } else {
            background = $scope.backgrounds[$index];
        }

        // Make http call
        var user = authService.currentUser();
        var url = '/api/user/' + user._id;
        $http({
            method: 'PUT',
            url: url,
            params: {
                user_id: user._id
            },
            data: {
                backgroundName: background.name
            },
        }).then(function successCallack() {
            
            // Change background showing on client side
            $scope.changeBackgroundImage(background);
        })
    }

    // Boolean indicating whether background is default
    $scope.showDefault = true;

    // Change background showing on client side
    $scope.changeBackgroundImage = function (background) {

        if (background.name === 'default') {
            return $scope.showDefault = true;
        }

        $scope.showDefault = false;
        var property = 'url(' + background.url + ')';

        $('.background .user-choice').css('background', property);
    }


    // On resize
    angular.element($window).bind("resize", function (event) {

        // If window is size xs
        if ($window.innerWidth <= 768) {
            $scope.backgroundMenu.open = false;
            $scope.collapseMenu.open = true;
        }

        // Reposition background menu
        $scope.positionBackgroundMenu();
    });

    // Boolean indicating whether about modal is open
    $scope.about = {
        open: false
    };

    // Open about modal
    $scope.openAbout = function () {
        $scope.about.open = true;
    }

    // Close about modal
    $scope.closeAbout = function ($event) {
        $scope.about.open = false;
    }

});
