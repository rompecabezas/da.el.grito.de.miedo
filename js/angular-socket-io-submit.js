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

	$scope.game = {
		msgforuser:'',
		registredusers:11,
		peopleOnline:2
	};


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
		$scope.game.registredusers = data.registredusers;
  });

	socket.on('user::left', function(data) {
    console.log(data);
		$scope.game.peopleOnline = data.peopleOnline;
  });

  socket.on('user::responses', function(data) {
    console.log(data);
		if(data.success == 'success'){
			$scope.game.msgforuser = '¡Gracias por participar! Anunciaremos al ganador de los boletos el 17 de septiembre, al rededor del mediodia';
			$scope.game.registredusers = data.registredusers;
		}
		else
			$scope.game.msgforuser = 'Hubo un error con tu email o tu nombre, por favor revísalos y vuelve a intentar';
  });

  $scope.send = function(){
    console.log($scope.form);
    socket.emit('user::responses',$scope.form);
  };

}]);
