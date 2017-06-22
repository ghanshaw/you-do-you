// Instantiate YouDoYou app
var ydyApp = angular.module('ydyApp', ['ngRoute', 'ngMaterial', '720kb.datepicker', 'ngResource'])
  // Declare rootscope variables
  .run(function($rootScope, $location, authService) {

    // Redirect to login page if user is not logged in
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
      if ($location.path() === '/todos' && !authService.isLoggedIn()) {
        $location.path('/');
      }
    });
  });
  

// Route view based on location path
ydyApp.config(function ($routeProvider, $locationProvider) {
    
    // Remove hashbang in URL
    $locationProvider.hashPrefix('');
    
    // Use $routeProvider service for routing
    $routeProvider   
    
    // Authentication portal (serves as homepage)
    .when('/', {
        templateUrl: 'partials/authentication.html',
        controller: 'authController'
    })

    // Todos page view
    .when('/todos',  {
        templateUrl: 'partials/todos.html',
        controller: 'todosController'     
    })    
    
    .otherwise({
      redirectTo: '/'
    });
    
});










// // 
// ydyApp.service('backgrounds', function($http) {
//   // Delete
//   return;

//   this.array = [];

//   $http.get('/background')
//     .then(
//       function(response) {
//         this.array = response.data;
//         console.log($scope.backgrounds);
//       },
//       function() {

//       }
//     )

// })


// ydyApp.controller('backgroundController', function($scope, $rootScope, $location, $http, authentication) {

//   $scope.isLoggedIn = function() {
//     return authentication.isLoggedIn();
//   }

// });