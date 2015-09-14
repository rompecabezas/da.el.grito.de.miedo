var grita = angular.module('grita-con-creepypastas', [
	'btford.socket-io'
]);;
angular.module('grita-con-creepypastas').factory('socket',['$rootScope', function ($rootScope) {
  var socket = io.connect('http://199.89.53.200:9129', {
      'reconnection delay': 2000,
      'force new connection': true
  });

  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}]);

angular.module('grita-con-creepypastas').controller('nlform-controller', ['$scope', 'socket', function($scope,socket) {

  $scope.form = {
		rplace:'',
		user:{
			name:'',
			email:'',
			likesCreepypastas:''
		}
	};

	$scope.game = {};


  socket.on('connect', function() {
		console.log('I\'im' + $scope.form);
      var event = {
          body: "User arrives"
      };
      socket.emit('user::arrives', event);
  });

  socket.on('user::arrives', function(data) {
    console.log(data);
		$scope.game.peopleOnline = data.peopleOnline;
  });

	socket.on('user::left', function(data) {
    console.log(data);
		$scope.game.peopleOnline = data.peopleOnline;
  });

  socket.on('user::responses', function(data) {
    console.log(data);
  });

  $scope.send = function(){
    console.log($scope.form);
    socket.emit('user::responses',$scope.form);
  };

}]);
