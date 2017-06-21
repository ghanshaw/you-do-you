var ydyApp = angular.module('ydyApp', ['ngRoute', 'ngMaterial', '720kb.datepicker', 'ngResource'])
  // Declare rootscope variables
  .run(function($rootScope, $location, authentication) {

    // Redirect to login page if user is not logged in
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
      if ($location.path() === '/todos' && !authentication.isLoggedIn()) {
        $location.path('/');
      }
    });

    // $rootScope.authenticated = false;
    // // $rootScope.current_user_name = '';
    // // $rootScope.current_user_email = '';
    // $rootScope.current_user = {};

    // $rootScope.signout = function() {
    //   $http.get('/users/signout');
    //   $rootScope.authenticated = false;
    //   $rootScope.current_user = {};
    //   // $rootScope.current_user_name = '';
    // }


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


ydyApp.service('authentication', function($window, $http, $location) {

  var saveToken = function(token) {
    $window.localStorage['ydy-token'] = token;
  }

  var getToken = function() {
    return $window.localStorage['ydy-token'];
  }

  var isLoggedIn = function() {
    var token = getToken();
    var payload;

    if(token) {
      payload = token.split('.')[1];
      payload = $window.atob(payload);
      payload = JSON.parse(payload);

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  var currentUser = function() {
    if(isLoggedIn()) {
      var token = getToken();
      var payload = token.split('.')[1];
      payload = $window.atob(payload);
      payload = JSON.parse(payload);
      return {
        email : payload.email,
        name : payload.name,
        _id: payload._id,
        settings: payload.settings
      };
    }
  };

  var error = {
    message: ''
  }

  var login = function(user) {

    $http.post('/users/login', user)
      .then(
      // Login success  
      function(response) {
        var success = response.data.success;
        if (success) {
          saveToken(response.data.token);
          $location.path('/todos');
          error.message = '';
        }
        else {
          error.message = response.data.message;
        }

        console.log('client side')
        // $rootScope.authenticated = true;
        // $rootScope.current_user = response.data.user;

      }, 
      // Login failure
      function(response) {
        console.log(response);

        error.message = response.data.message;
        // return {
        //   success: false,
        //   message: response.data.message
        // }
      });
  }

  var register = function(user) {
    $http.post('/users/register', user)
      .then(function(response) {

        var success = response.data.success;
        if (success) {
          saveToken(response.data.token);
          $location.path('/todos');
          error.message = '';
        }
        else {
          error.message = response.data.message;
        }



      }, function(response) {
        console.log('User was not created')
        error.message = response.data.message;
        // TODO inform user of error
      });
  }

  var logout = function() {
    var user = currentUser();
    

    config = {
      method: "GET",
      url: "/users/logout",
      params: {
        sample: false
      }
    }

    if (user.email === 'peter.parker@email.com') {
      config.params.sample = true;
    }

    $http(config)
    // $http('/users/logout', config)
      .then(function() {
        console.log('Successfully logged out.')

        $window.localStorage.removeItem('ydy-token');
        $location.path('/');
        error.message = '';
      },
      function() {
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

ydyApp.factory('todoFactory', function($http, $rootScope, $resource, authentication) {

  // var factory = {};

  // factory.getAll = function() {
  //   return $http.get('/api/todos');
  // }

  var factory = {}


 // var user_id = authentication.currentUser()._id;
  // var params = { user_id: $rootScope.current_user._id }
  // var params = 

  
  factory.getResource = function() {
    // params.user_id = $rootScope.current_user._id;
    
    // params.user_id = authentication.currentUser()._id;

    return $resource(
      // URL
      '/api/user/:user_id/todos/:todo_id', 
      // Default params
      // params, 
      { user_id: authentication.currentUser()._id },
      // Additional actions
      {  'update': { method:'PUT' } }
    );
  }

  // return factory;
  
  return factory

});

ydyApp.service('backgrounds', function($http) {
  // Delete
  return;

  this.array = [];

  $http.get('/background')
    .then(
      function(response) {
        this.array = response.data;
        console.log($scope.backgrounds);
      },
      function() {

      }
    )

})

ydyApp.controller('backgroundController', function($scope, $rootScope, $location, $http, authentication) {

  $scope.isLoggedIn = function() {
    return authentication.isLoggedIn();
  }

});

ydyApp.controller('authController', function($scope, $rootScope, $location, $http, authentication, todoFactory) {

  $scope.user = {
    email: '',
    name: '',
    password: '',
    password2: '',
  } 

  $scope.login = function() {
    if ($scope.validateForm('login')) {
      authentication.login($scope.user);
    }

    // console.log($scope.changeBackgroundImage);
    // changeBackgroundImage(user.settings.background)
  }

  $scope.register = function() {
    if ($scope.validateForm('register')) {
      authentication.register($scope.user);
    }
    
  }

  $scope.guestLogin = function() {
    let user = {
      email: 'peter.parker@email.com',
      password: 'spiderman',    
    }
    
    authentication.login(user)
  }

  $scope.hasError = function() {
    return authentication.error.message !== ''
  }

  $scope.getError = function() {
    return authentication.error.message;
  }


  $scope.isValidEmail = function (email) {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  $scope.error = {
    message: ''
  }
  $scope.validateForm = function(form) {

    // Empty email
    if ($scope.user.email == '') {
      authentication.error.message = 'An email address is required.';
      return false;
    }

    // Empty password
    if ($scope.user.password == '') {
      authentication.error.message = 'A password is required.';
      return false;
    }

    // Empty password 2
    if (form === 'register' && $scope.user.password2 == '') {
      authentication.error.message = 'Please populate both password fields.';
      return false;
    }

    // Empty name
    if (form === 'register' && $scope.user.name == '') {
      authentication.error.message = 'A name is required.';
      return false;
    }

    // Invalid Email
    if (!$scope.isValidEmail($scope.user.email)) {
      authentication.error.message = 'Please enter a valid email address';
      return false;
    }

    return true;    
  }

  // $scope.login = function() {

  //   $http.post('/users/login', $scope.user)
  //     .then(function(response) {
  //       console.log('client side')
  //       $rootScope.authenticated = true;
  //       $rootScope.current_user = response.data.user;

  //       $location.path('/todos');
  //     });
  // }

  // $scope.register = function() {
  //   $http.post('/users/register', $scope.user)
  //     .then(function(response) {
  //       console.log('client side')
  //       $rootScope.authenticated = true;
  //       $rootScope.current_user = response.data.user;

  //       $location.path('/todos');
  //     }, function(response) {
  //       console.log('User was not created')

  //       // TODO inform user of error
  //     });
  // }


  // $scope.authWindow
  $scope.authentication = {
    login: true,
    signup: false
  }

  $scope.toggleAuthentication = function(form) {

    if (form === 'login') {
      $scope.authentication.login = true;
      $scope.authentication.signup = false;
    }

    else if (form === 'signup') {
      $scope.authentication.login = false;
      $scope.authentication.signup = true;
    }
  }

});


ydyApp.controller('mainController', function($scope, $http, $window, authentication) {

  // $scope.backgrounds = backgrounds.array

  // $http.get('/background')
  //   .then(
  //     function(response) {
  //       $scope.backgrounds = response.data;
  //       console.log($scope.backgrounds);
  //     },
  //     function() {

  //     }
  //   )

  console.log('kjasdjfkasdf');

  $scope.windowScroll = {
    off: false
  }

  $scope.isLoggedIn = function() {
    return authentication.isLoggedIn();
  }

  $scope.logout = function() {
    authentication.logout();

    // TODO logoug on backend using api
  }

  


  $scope.backgrounds = [
    {
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

  $scope.collapseMenu = {
    open: false,
    element: $('div.navbar-collapse'),
    offset: 0,
    height: 0
  }


  $scope.backgroundMenu = {
    open: false,
  }
  

  $scope.positionBackgroundMenu = function() {

    // if (!$scope.collapseMenu.open) return;      
    
    $scope.collapseMenu.offset = $($scope.collapseMenu.element).offset().top;
    $scope.collapseMenu.height = $($scope.collapseMenu.element).height();

    var backgroundMenu = $('div.user-select-background');
    $(backgroundMenu).css('top', $scope.collapseMenu.offset + $scope.collapseMenu.height + 10);

  }

  $scope.toggleBackgroundMenu = function() {
    $scope.positionBackgroundMenu();
    $scope.backgroundMenu.open = !$scope.backgroundMenu.open;
  }

  $scope.closeBackgroundMenu = function() {
    $scope.backgroundMenu.open = false;
  }

  $scope.updateUserBackground = function($index, backgroundName) {

    var background = {};
    if ($index === null) {
      for (b of $scope.backgrounds) {
        if (b.name === backgroundName) {
          background = b;
          break;
        }
      }
    }
    else {
      background = $scope.backgrounds[$index];
    }
     
    var user = authentication.currentUser();
    var url = '/api/user/' + user._id;
    // var url = /api/user
    $http({
      method: 'PUT',
      url: url,
      params: { user_id: user._id }, 
      data: { backgroundName: background.name },
    }).then(function() {
      console.log('Successfully updated user choice.')
      $scope.changeBackgroundImage(background);

    })

  }


  $scope.showDefault = true;
  $scope.changeBackgroundImage = function(background) {
    
    if (background.name === 'default') {
      return $scope.showDefault = true;
    }

    $scope.showDefault = false;
    var property = 'url(' + background.url + ')';

    $('.background .user-choice').css('background', property);

  }


  angular.element($window).bind("resize", function(event) {
    
    // console.log($window);

    // If window is size xs
    if ($window.innerWidth <= 768) {
      $scope.backgroundMenu.open = false;
      $scope.collapseMenu.open = true;
      // $scope.$apply();
    }      

    $scope.positionBackgroundMenu();
             
  });

  // $(window).trigger('resize');

  

  $scope.checkWindow = function() {
    console.log($scope.windowScroll) ;
  }

  $scope.about = {
    open: false
  };

  $scope.closeAbout = function($event) {

    // console.log($($event.target).is('div.about-modal'));

    //$event.stopPropagation();

    // if ($($event.target).is('div.about-modal')) { return; }

    console.log($event)
    $scope.about.open = false;
  }

  $scope.openAbout = function() {
    $scope.about.open = true;
  }




});



ydyApp.controller('todosController', function($scope, $location, $rootScope, $http, $filter, $window, $interval, todoFactory, authentication) {

  var user = authentication.currentUser();
  (function() {
    var backgroundName = user.settings.background;
    $scope.updateUserBackground(null, backgroundName);
  })();

  // if (!$rootScope.authenticated) {
  //   $location.path('/');
  //   return;
  // }

  var todoResource = todoFactory.getResource();

  $scope.firstname = '';
  if (authentication.isLoggedIn()) {
    let user = authentication.currentUser();
    let name = user.name.split(' ');
    $scope.firstname = name[0];
  }
  

  $scope.todos = todoResource.query(
    // Success callback
    function() {
      console.log($scope.todos);
    });

  // $scope.todos = [];
  // todoFactory.getAll().then(function(res) {
  //   $scope.todos = res.data;
  //   console.log($scope.todos);
  // })

  // Get date and time
  
  $scope.date = '';
  $scope.time = '';

  var updateClock = $interval(function() {

    // var date = Date.now();
    $scope.date = $filter('date')(Date.now(), 'EEEE, MMMM d');
    $scope.time = $filter('date')(Date.now(), 'shortTime');

  }, 30);


  // Add date suffix
  var suffixes = ["th", "st", "nd", "rd"];
  var day = parseInt($scope.date.slice(-2));
  var relevantDigits = (day < 30) ? day % 20 : day % 30;
  var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
  $scope.date += suffix;

  $scope.toggleComplete = function(todo) {
    todo.isDone = !todo.isDone;
    $scope.updateTodo(todo);
  }

  $scope.newTodoText = '';

  $scope.enterTask = function(todo) {
    todo.hovering = true;
  }

  // Set hovering to false, end editing
  $scope.leaveTask = function(todo) {
    todo.hovering = false;
    return;
    if (todo.editing) {
      todo.editing = false;
      $scope.updateTodo(todo);
    }
  }



  $scope.createTodo = function() {

    if ($scope.newTodoText == '') return;
    console.log($scope.newTask);

    var user = authentication.currentUser();

    // Create new todo
    var newTodo = {
      isDone: false, 
      text: $scope.newTodoText,
      created_at: Date.now(),
      dueDate: null,
      user_id: user._id,
      email: user.email
    }

    
    // $scope.todos.push(todo);

    todoResource.save(
    // Post data
    newTodo, 
    // Success callback
    function() {
      // Clear todo text on frontend
      $scope.newTodoText = '';

      // Get todos from server
      var allTodos = todoResource.query(
        function() {
          // Update Task List Window
          $scope.atTop();
          $scope.atBottom();
          $scope.todos = allTodos;
        }
      );      
    },
    // Error callback
    function() {
      // Clear todo text on frontend
      $scope.newTodoText = '';
      console.error('Todo not saved to server. Please try again.');
    }); 

  }

  $scope.countComplete = function() {
    let count = 0;
    for (t of $scope.todos) {
      if (t.isDone) count++;
    }
    $scope.complete = count;
    return count;
  }

  $scope.countIncomplete = function() {
    let count = 0;
    for (t of $scope.todos) {
      if (!t.isDone) count++;
    }
    $scope.incomplete = count;
    return count;
  }

  $scope.percentDone = function() {
    if ($scope.todos.length == 0) {
      return $scope.percent = '- ';
    }
    else {
      $scope.percent = $scope.complete/$scope.todos.length * 100;
      return $filter('number')($scope.percent, 1);
    }
  }
  
  // Add task is user presses Enter
  $scope.enterInput = function($event) {
    if ($event.keyCode == 13) {
      $scope.createTodo();
    }
  }

  // Checks if user has scrolled to top of div
  $scope.atTop = function() {
    var listWindow = $('.list-task .window');
    $scope.distanceFromTop = $(listWindow).scrollTop();

    console.log('Distance from Top: ' + $scope.distanceFromTop);
    

    //return distanceFromTop == 0;

  }

  $scope.distanceFromBottom = 0;
  $scope.distanceFromTop = 0;

  // Checks if user has scrolled to top of div
  $scope.atBottom = function() {


    var listWindow = $('.list-task .window');

    var scrollHeight = listWindow[0].scrollHeight;
    var divHeight = listWindow.height();

    console.log(scrollHeight, divHeight);

    if (scrollHeight <= divHeight) {
      $scope.distanceFromBottom = 0;
    }

    var distanceFromTop = $(listWindow).scrollTop();
    $scope.distanceFromBottom = scrollHeight - divHeight - distanceFromTop

    console.log($scope.distanceFromBottom);

    //return distanceFromBottom == 0;
  }

  var listWindow = $('.list-task .window');
  angular.element(listWindow).bind("scroll", function(event) {

        


        $scope.atTop();
      $scope.atBottom();
    $scope.$apply();
      
             
  });



  $scope.stopWindowScroll = function() {

    $scope.windowScroll.off = true;

  }

  $scope.resumeWindowScroll = function() {

    $scope.windowScroll.off = false;

  }



  var date = new Date();
  date.setDate(date.getDate() - 1);
  console.log(date.toString())
  $('datepicker').attr('date-min-limit', date.toString());

  $scope.editTodo = function(todo) {
    if (todo.isDone) return;
    todo.editing = true;
  }

  $scope.stopEditTodo = function(todo) {
    //var d = new Date(todo.dueDate);
    todo.editing = false;
    $scope.updateTodo(todo);
    //todo.dueDateNum = d.getTime();

  };
  

  $scope.updateTodo = function(todo) {

    // todo.dueDate = new Date(todo.dueDate);

    var params = { todo_id: todo._id }
    todoResource.update(
      params,
      todo,
      
      // Success callback
      function() {
        // Get todos from server
        var allTodos = todoResource.query(
          function() {
            // Update Task List Window
            $scope.todos = allTodos;
          }
        );   
      },
      // Failure callback
      function() {

       console.error('Todo not updated on server. Please try again.');

        // Get todos from server
        var allTodos = todoResource.query(
          function() {
            // Update Task List Window
            $scope.todos = allTodos;
          }
        );      
      });

  }

  $scope.keyStopEditTodo = function($event, todo) {

    var keyCode = $event.keyCode;

    // Enter -> 13, Escape -> 27
    if (keyCode === 13 || keyCode === 27) {
      $scope.stopEditTodo(todo);
    }
  }

  $scope.deleteTodo = function(todo) {

    var params = { todo_id: todo._id }
    todoResource.delete(
      params,
      // Success callback
      function() {
        // Get todos from server
        var allTodos = todoResource.query(
          function() {
            // Update Task List Window
            $scope.todos = allTodos;
          }
        );   
      },
      // Failure callback
      function() {

       console.error('Todo not deleted from server. Please try again.');

        // Get todos from server
        var allTodos = todoResource.query(
          function() {
            // Update Task List Window
            $scope.todos = allTodos;
          }
        );      
      });

  }

  // Determine if datepicker is closer to top or bottom of window
  $scope.closerToTop = function($index) {

    // console.log($('datepicker')[$index]);

    var element = $('datepicker')[$index];

    var elementTop = $(element).offset().top;
    var listWindowTop = $('.list-task .window').offset().top;
    var listWindowBottom = listWindowTop + $('.list-task .window').height();

    return (listWindowTop - elementTop) < (elementTop - listWindowBottom)

  }
  

  console.log($scope.date);
  console.log($scope.time);

  $scope.todos2 = [
    {
      isDone: false,
      content: 'Get milk',
      dueDate: null,
      dateCreated: 1497802960006,
      id: 001
    },
    {
      isDone: true,
      content: 'Buy eggs.',
      dueDate: null,
      dateCreated: 1497802932306,
      id: 002
    },
    // Oldest
    {
      isDone: false,
      content: 'Break bread.',
      dueDate: null,
      dateCreated: 297802962306,
      id: 003
    }
  ]

});
