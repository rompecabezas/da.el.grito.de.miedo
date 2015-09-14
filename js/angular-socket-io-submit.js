var aria = angular.module('grita-con-creepypastas', [
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
  socket.on('connect', function() {
      var event = {
          body: "User arrives"
      };
      socket.emit('user::arrives', event);
  });

  socket.on('user::arrives', function(data) {
    console.log(data);
  });


  $scope.send = function(){
    alert(':D');
  }

}]);
