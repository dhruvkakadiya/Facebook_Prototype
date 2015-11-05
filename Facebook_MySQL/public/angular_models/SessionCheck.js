var app = angular.module('myApp', []);
app.controller('homePage', function($scope,$http) {
    $http.get('/sessionGet').success(function (response) {
			    			console.log("Successfully session get");
			    		//$sessionStorage.newspost = response.newspost; 
			    		$scope.sessionVar = response.sessionVar;
			    		$scope.newspost = response.newspost;
			    		//console.log(news[0]["news"]);
			    		alert('Hi '+ $scope.sessionVar);
			  			});
    $scope.search = function(){
			//alert("hello world");
			sessionStorage.searchPer = $scope.searchPerson;
	    	$http({
	            method: 'GET',
	            url: '/searchResults'
	         })
			window.location = '/searchResults';
		};

	$scope.connections = function(){
	    	$http({
	            method: 'POST',
	            url: '/connections'
	         })
			window.location = '/connections';
		};

	$scope.groups = function(){
	    	$http({
	            method: 'GET',
	            url: '/groups'
	         })
			window.location = '/groups';
		};
});

var example = angular.module('sessionApp', []);
example.controller('exampleController',function($scope,$localStorage){
	$scope.saveData = function(){
		$localStorage.message = "Hello World!";
		//window.localStorage.set("message","Hello World");
	}

	$scope.loadData = function(){
		$scope.message = $localStorage.message;
		//$scope.message = JSON.parse(window.localStorage.get("message"));
	} 
});

angular.module('httpApp')
	.service('task',function task($http, $q, $rootScope){

	});

