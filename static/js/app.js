/* globals angular  */

function get_to_top() {
    $('body, html').animate({
        scrollTop: 0
    }, 800);
}

var panopticon = angular.module('panopticon', ['ngRoute', 'ng-showdown', 'angularMoment', 'angular-loading-bar'])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }]);

panopticon.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/join', {
                templateUrl: 'partials/join.html'
            }).
            when('/support', {
                templateUrl: 'partials/support.html'
            }).
            when('/faq', {
                templateUrl: 'partials/faq.html'
            }).
            when('/projects', {
                templateUrl: 'partials/projects.html'
            }).
            when('/services', {
                templateUrl: 'partials/services.html'
            }).
            when('/updates/:uuid', {
                templateUrl: 'partials/updates.html'
            }).
            when('/location', {
                templateUrl: 'partials/location.html',
                redirectTo: get_to_top
            }).
            when('/people', {
                templateUrl: 'partials/people.html',
                redirectTo: get_to_top
            }).
            when('/supporters', {
                templateUrl: 'partials/supporters.html',
                redirectTo: get_to_top
            }).
            when('/library', {
                templateUrl: 'partials/library.html',
                redirectTo: get_to_top
            }).
            otherwise({
                templateUrl: 'partials/vision.html'
            });
    }
]);

panopticon.controller('booksCtrl', function ($scope, $http) {
    $http.get('library/books.json').success(function(data) {
        $scope.books = data;
    });
});

panopticon.controller('updatesCtrl', function ($scope, $routeParams, $http) {
    $http.get('https://librenet.gr/posts/' + $routeParams.uuid + '.json').success(function(item) {
        $scope.update = item;
    });
});
