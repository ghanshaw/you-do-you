var ydyApp = angular.module('ydyApp', ['ngRoute', 'ngMaterial', '720kb.datepicker']);

// Route view based on location path
ydyApp.config(function ($routeProvider, $locationProvider) {
    
    // Remove hashbang in URL
    $locationProvider.hashPrefix('');
    
    // Use $routeProvider service for routing
    $routeProvider   
    
    .when('/', {
        templateUrl: 'partials/login.html',
        controller: 'loginController'
    })

    .when('/todos',  {
        templateUrl: 'partials/todos.html',
        controller: 'todosController'     
    })    
    
    .when('/todos/:id',  {
        templateUrl: 'partials/todos.html',
        controller: 'todosController'     
    })    
    
    .otherwise({
      redirectTo: '/'
    });
    
});

ydyApp.controller('backgroundController', function($scope, $http) {


});

ydyApp.controller('loginController', function($scope, $http) {

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


ydyApp.controller('mainController', function($scope, $http, $window) {

  console.log('kjasdjfkasdf');

  $scope.windowScroll = {
    off: false
  }



  $scope.images = [
    {
      thumb: 'images/backgrounds/city-thumb.jpg',
      url: 'images/backgrounds/city.jpg'
    },
    {
      thumb: 'images/backgrounds/lake-thumb.jpg',
      url: 'images/backgrounds/lake.jpg'
    },
    {
      thumb: 'images/backgrounds/rockies-thumb.jpg',
      url: 'images/backgrounds/rockies.jpg'
    },
    {
      thumb: 'images/backgrounds/snow-thumb.jpg',
      url: 'images/backgrounds/snow.jpg'
    },
    {
      thumb: 'images/backgrounds/space-thumb.jpg',
      url: 'images/backgrounds/space.jpg'
    },
    {
      thumb: 'images/backgrounds/waterfall-thumb.jpg',
      url: 'images/backgrounds/waterfall.jpg'
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

  $scope.changeBackgroundImage = function($index) {

    var url = $scope.images[$index].url;
    var property = 'url(' + url + ')';

    $('.background .user-choice').css('background', property);

    //background: url('../images/backgrounds/space.jpg');


  }


  angular.element($window).bind("resize", function(event) {
    
    // console.log($window);

    // If window is size xs
    if ($window.innerWidth <= 768) {
      $scope.backgroundMenu.open = false;
      $scope.collapseMenu.open = true;
      $scope.$apply();
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



ydyApp.controller('todosController', function($scope, $http, $filter, $window, $interval) {

  // $( function() {
  //   $( "#datepicker" ).datepicker();
  // } );

  // $scope.myDate = new Date();
  // $scope.isOpen = false;

  // $(window).click(function() {
  //   console.log('clicked');
  //   for (t of $scope.todos) {
  //     console.log(t);
  //     t.editing = false;
  //   }
  //   $scope.$apply();
  // });



  //$('[data-toggle="datepicker"]').datepicker();


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
  }

  $scope.newTaskContent = '';

  $scope.enterTask = function(todo) {
    todo.hovering = true;
  }

  // Set hovering to false, end editing
  $scope.leaveTask = function(todo) {
    todo.hovering = false;
    todo.editing = false;
  }



  $scope.addTask = function() {

    if ($scope.newTaskContent == '') return;
    console.log($scope.newTask);

    // Create new todo
    var todo = {
      isDone: false, 
      content: $scope.newTaskContent,
      id: Math.random() * 10,
      dateCreated: Date.now(),
      dueDate: null
    }

    $scope.newTaskContent = '';
    $scope.todos.push(todo);

    // Update Task List Window
    $scope.atTop();
    $scope.atBottom();

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
    $scope.percent = $scope.complete/$scope.todos.length * 100;
    return $filter('number')($scope.percent, 1);
  }
  
  // Add task is user presses Enter
  $scope.enterInput = function($event) {
    if ($event.keyCode == 13) {
      $scope.addTask();
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
    var d = new Date(todo.dueDate);
    todo.dueDateNum = d.getTime();
    todo.editing = false;
    console.log(todo);
  }


  $scope.keyStopEditTodo = function($event, todo) {

    var keyCode = $event.keyCode;

    // Enter -> 13, Escape -> 27
    if (keyCode === 13 || keyCode === 27) {
      $scope.stopEditTodo(todo);
    }
  }

  $scope.deleteTodo = function(todo) {
    var index = $scope.todos.findIndex(function(t, i) {
      return t.id == todo.id;
    });
    $scope.todos.splice(index, 1);
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

  $scope.todos = [
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




ydyApp.controller('oldMainController', function ($scope, $http, $interval) {
  // return;
  // console.log('kajskdfjaksf');

  // width = $(window).width();
  // height = $(window).height();


  // var maxC = 15;
  // var minC = 2;

  // var n = 1;
  // var c = Math.random() * maxC + minC;

  // var a;
  // var r;
  // var x;
  // var y;

  // var canvas = $('canvas.background');

  // var canvas = document.getElementById("background");
  // var ctx = canvas.getContext("2d");

  // canvas.width = ctx.width = width;
  // canvas.height = ctx.height = height;

  // var divergence = 136.8 + Math.random();


  

  

  // var colors = [
  //   '#FFF',
  //   '#FFF'
  // ]

  // var colors = [
  //   '#F44336',
  //   '#E91E63',
  //   '#673AB7',
  //   '#2196F3',
  //   '#00BCD4',
  //   '#4CAF50',
  //   '#FFEB3B',
  //   '#FF9800',
  // ]

  // var origin = {
  //   x: width/2,
  //   y: height/2
  // }


  //     // Select colors randomly
  //   var index1 = Math.floor(colors.length * Math.random());
  //   do {
  //     var index2 = Math.floor(colors.length * Math.random());
  //   }
  //   while (index1 === index2);

  //   var hex1 = colors[index1];
  //   var hex2 = colors[index2];

  //   var rgba1 = hexToRgba(hex1);
  //   var rgba2 = hexToRgba(hex2);

  //   var speed = 0;

  //   var circleR = 2;
  //   divergence = 137.5;




  // $interval(function() {

  //   //$(canvas).css("transform", "rotate(" + -speed / 2 + "deg)");

  //   var step = 1;
  //   var step2 = 0
  //   divergence += step2;

  //   console.log('running');

  //   a = n * divergence;
  //   r = c * Math.pow(n, .5)

  //   x = r * Math.cos(a) + width/2;
  //   y = r * Math.sin(a) + height/2;

  //   console.log(x, y)



  //   // Get distance from origin
  //   var distance = Math.pow(Math.pow(x - origin.x, 2) + Math.pow(y - origin.y, 2), .5);
  //   var total_distance = Math.pow(Math.pow(origin.x, 2) + Math.pow(origin.y, 2), .5);

  //   // Percent is distance from origin over total visible distance
  //   var percent = Math.abs( distance/total_distance )
  //   console.log(percent);

  //   // Calculate gradient
  //   var gradient = interpolateColor(rgba1, rgba2, 1, percent);
  //   console.log(gradient);

    

  //   // newCircle = document.createElement('div');
  //   // $(newCircle).css('position', 'absolute');
  //   // $(newCircle).css('top', y);
  //   // $(newCircle).css('left', x);
  //   // $(newCircle).css('background', 'blue');
  //   // $(newCircle).css('border-radius', '50%');
  //   // $(newCircle).css('width', '5px');
  //   // $(newCircle).css('height', '5px');
  //   // $(newCircle).appendTo('body');

    
  //   circleR *= step;

  //   ctx.beginPath();
  //   ctx.fillStyle = gradient;
  //   ctx.arc(x, y, circleR, 0, 2*Math.PI);
  //   ctx.fill();

  //   n++;
  //   speed += .05;
  //   console.log(n);

  // });

  //phyllotaxis();
});





// // Change Hex volor to RGBA object, add alpha
// hexToRgba = function(hex, alpha){
    
//     var c;
//     if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
//         c= hex.substring(1).split('');
//         if(c.length === 3){
//             c = [c[0], c[0], c[1], c[1], c[2], c[2]];
//         }
//         c = '0x'+c.join('');
//         return {
//             red: (c >> 16) & 255,
//             green: (c >> 8) &255,
//             blue: c & 255,
//             alpha: alpha
//         };
//     }
//     throw new Error('Bad Hex');
    
// };

// // Stringify rgba object
// rgbaToString = function(rgba) {   
//     return 'rgba(' + rgba.red + ', ' + rgba.green + ', ' + rgba.blue + ',' + rgba.alpha + ')';   
// };

// // Interpolate color value between two colors using percent
// interpolateColor = function(color1, color2, alpha, percent) {
    
//     var resultRed = color1.red + percent * (color2.red - color1.red);
//     var resultGreen = color1.green + percent * (color2.green - color1.green);
//     var resultBlue = color1.blue + percent * (color2.blue - color1.blue);
    
//     resultRed = Math.floor(resultRed);
//     resultGreen = Math.floor(resultGreen);
//     resultBlue = Math.floor(resultBlue);    
    
//     var rgba = 'rgba(' + resultRed + ', ' + resultGreen + ', ' + resultBlue + ',' + alpha + ')';
    
//     return rgba;     
// };

// ydyApp.service('spiral', function() {

//   // Change Hex volor to RGBA object, add alpha
// this.hexToRgba = function(hex, alpha) {
    
//     var c;
//     if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
//         c= hex.substring(1).split('');
//         if(c.length === 3){
//             c = [c[0], c[0], c[1], c[1], c[2], c[2]];
//         }
//         c = '0x'+c.join('');
//         return {
//             red: (c >> 16) & 255,
//             green: (c >> 8) &255,
//             blue: c & 255,
//             alpha: alpha
//         };
//     }
//     throw new Error('Bad Hex');
    
// };

// // Stringify rgba object
// this.rgbaToString = function(rgba) {   
//     return 'rgba(' + rgba.red + ', ' + rgba.green + ', ' + rgba.blue + ',' + rgba.alpha + ')';   
// };

// // Interpolate color value between two colors using percent
// this.interpolateColor = function(color1, color2, alpha, percent) {
    
//     var resultRed = color1.red + percent * (color2.red - color1.red);
//     var resultGreen = color1.green + percent * (color2.green - color1.green);
//     var resultBlue = color1.blue + percent * (color2.blue - color1.blue);
    
//     resultRed = Math.floor(resultRed);
//     resultGreen = Math.floor(resultGreen);
//     resultBlue = Math.floor(resultBlue);    
    
//     var rgba = 'rgba(' + resultRed + ', ' + resultGreen + ', ' + resultBlue + ',' + alpha + ')';
    
//     return rgba;     
// };


//   var maxC = 15;
//   var minC = 2;

//   var n = 1;
//   var c = Math.random() * maxC + minC;

//   var a;
//   var r;
//   var x;
//   var y;

//   var canvas = $('canvas.background');

//   var canvas = document.getElementById("background");
//   this.ctx = canvas.getContext("2d");

//   canvas.width = ctx.width = width;
//   canvas.height = ctx.height = height;

//   this.divergence = 136.8 + Math.random();


//   var colors = [
//     '#F44336',
//     '#E91E63',
//     '#673AB7',
//     '#2196F3',
//     '#00BCD4',
//     '#4CAF50',
//     '#FFEB3B',
//     '#FF9800',
//   ]



//   var origin = {
//     x: width/2,
//     y: height/2
//   }



// });