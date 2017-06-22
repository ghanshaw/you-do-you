ydyApp.controller('todosController', function ($scope, $location, $rootScope, $http, $filter, $window, $interval, restFactory, authService) {

  // Get current user from authentication service
  var user = authService.currentUser();

  // Update background to match user's preference 
  // Relevant when resuming session, return directly to url
  (function () {
    var backgroundName = user.settings.background;
    $scope.updateUserBackground(null, backgroundName);
  })();

  // Get http resource object from factory
  var httpResource = restFactory.getResource();

  // Extract first name from user
  $scope.firstname = '';
  if (authService.isLoggedIn()) {
    let name = user.name.split(' ');
    $scope.firstname = name[0];
  }

  // Get todos via API
  $scope.todos = httpResource.query(
    // Success callback
    function successCallback() {
      // console.log($scope.todos);
    });


  // Get date and time
  $scope.date = '';
  $scope.time = '';

  // Update clock on user profile
  var updateClock = $interval(function () {

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

  // Toggle todo as complete
  $scope.toggleComplete = function (todo) {
    todo.isDone = !todo.isDone;
    $scope.updateTodo(todo);
  }

  // Store text for new todo
  $scope.newTodoText = '';

  // Mouseenter todo
  $scope.enterTask = function (todo) {
    todo.hovering = true;
  }

  // Mouseleave todo
  $scope.leaveTask = function (todo) {
    todo.hovering = false;
    return;

    // Formally, stop edit on mouseleave
    // if (todo.editing) {
    //   todo.editing = false;
    //   $scope.updateTodo(todo);
    // }
  }

  // Create new todo
  $scope.createTodo = function () {

    // Don't create if there's not text
    if ($scope.newTodoText == '') return;

    // Create new todo
    var newTodo = {
      isDone: false,
      text: $scope.newTodoText,
      created_at: Date.now(),
      dueDate: null,
      user_id: user._id,
      email: user.email
    }

    httpResource.save(
      // Post data
      newTodo,
      function successCallback() {
        // Clear todo text on frontend
        $scope.newTodoText = '';

        // Get todos from server
        var allTodos = httpResource.query(
          function () {
            // Update task list Window
            // $scope.atTop();
            // $scope.atBottom();
            $scope.todos = allTodos;
          }
        );
      },
      function errorCallback() {
        // Clear todo text on frontend
        $scope.newTodoText = '';
        console.error('Todo not saved to server. Please try again.');
      });
  }

  // Count completed todos
  $scope.countComplete = function () {
    let count = 0;
    for (t of $scope.todos) {
      if (t.isDone) count++;
    }
    $scope.complete = count;
    return count;
  }

  // Count incomplete todos
  $scope.countIncomplete = function () {
    let count = 0;
    for (t of $scope.todos) {
      if (!t.isDone) count++;
    }
    $scope.incomplete = count;
    return count;
  }

  // Calculate percent of complete todos
  $scope.percentDone = function () {
    if ($scope.todos.length == 0) {
      return $scope.percent = '- ';
    } else {
      $scope.percent = $scope.complete / $scope.todos.length * 100;
      return $filter('number')($scope.percent, 1);
    }
  }

  // Add task is user presses Enter
  $scope.enterInput = function ($event) {
    if ($event.keyCode == 13) {
      $scope.createTodo();
    }
  }

  // Edit todo
  $scope.editTodo = function (todo) {
    if (todo.isDone) return;
    todo.editing = true;
  }

  // Stop editing todo
  $scope.stopEditTodo = function (todo) {
    //var d = new Date(todo.dueDate);
    todo.editing = false;
    $scope.updateTodo(todo);
  };

  // Update todo on server side
  $scope.updateTodo = function (todo) {

    var params = {
      todo_id: todo._id
    }
    httpResource.update(
      params,
      todo,
      function successCallback() {
        // Get todos from server
        var allTodos = httpResource.query(
          function () {
            // Update Task List Window
            $scope.todos = allTodos;
          }
        );
      },
      function errorCallback() {
        console.error('Todo not updated on server. Please try again.');
        // Get todos from server
        var allTodos = httpResource.query(
          function () {
            // Update Task List Window
            $scope.todos = allTodos;
          }
        );
      });
  }

  // Stop editing todo with enter or escape key
  $scope.keyStopEditTodo = function ($event, todo) {

    var keyCode = $event.keyCode;

    // Enter -> 13, Escape -> 27
    if (keyCode === 13 || keyCode === 27) {
      $scope.stopEditTodo(todo);
    }
  }

  // Delete todo
  $scope.deleteTodo = function (todo) {

    var params = {
      todo_id: todo._id
    }
    httpResource.delete(
      params,
      function successCallback() {
        // Get todos from server
        var allTodos = httpResource.query(
          function () {
            // Update Task List Window
            $scope.todos = allTodos;
          }
        );
      },
      function errorCallback() {

        console.error('Todo not deleted from server. Please try again.');

        // Get todos from server
        var allTodos = httpResource.query(
          function () {
            // Update Task List Window
            $scope.todos = allTodos;
          }
        );
      });
  }

  // Lock window scroll
  $scope.stopWindowScroll = function () { $scope.windowScroll.off = true; }

  // Unlock window scroll
  $scope.resumeWindowScroll = function () { $scope.windowScroll.off = false; }

  // Tweaking task list window

  // Check distance from top of task list window
  $scope.getDistanceFromTop = function() {
    var listWindow = $('.list-task .window');
    var distanceFromTop = $(listWindow).scrollTop();
    return distanceFromTop;
  }

  // Checks if user has scrolled to top of div
  $scope.getDistanceFromBottom = function () {

    var listWindow = $('.list-task .window');
    var scrollHeight = listWindow[0].scrollHeight;
    var divHeight = listWindow.height();
    var distanceFromBottom = 0;

    if (scrollHeight <= divHeight) {
      distanceFromBottom = 0;
    }
    else {
      var distanceFromTop = $(listWindow).scrollTop();
      // Subtract extra 5 just to be safe
      distanceFromBottom = scrollHeight - divHeight - distanceFromTop - 5
      distanceFromBottom = Math.max(0, distanceFromBottom);
    }

    return distanceFromBottom;
  }

  // Tweaking datepicker

  // Determine if datepicker is closer to top or bottom of window
  $scope.closerToTop = function ($index) {

    var element = $('datepicker')[$index];
    var elementTop = $(element).offset().top;
    var listWindowTop = $('.list-task .window').offset().top;
    var listWindowBottom = listWindowTop + $('.list-task .window').height();

    return (listWindowTop - elementTop) < (elementTop - listWindowBottom)
  }
});
