(function (angular) {

    var app = angular.module('app', ['ngRoute']);
    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
          when('/MyReports', {
              templateUrl: 'MyReports.html',
              controller: 'MyReportsController'
          }).
          when('/', {
              templateUrl: 'ReportTime.html',
              controller: 'ReportTimeController'
          }).
          otherwise({
              redirectTo: '/'
          });
    }]);

    app.controller('ReportTimeController', ['$scope', ReportTimeController]);

    function ReportTimeController() {

    }
    
    app.controller('MyReportsController', ['$scope', MyReportsController]);

    function MyReportsController() {

    }

})(window.angular);