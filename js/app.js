var app = angular.module('voteApp',['ngRoute', 'ngResource', 'angularUtils.directives.dirPagination'])
.config(function($routeProvider){
  $routeProvider.when('/newModerator', {
    templateUrl: '/templates/moderator/moderator-add.html',
    controller: 'CreateNewModerator',
    controllerAs: 'moderatorCtrl'
  })
  .when('/login', {
  	templateUrl:'/templates/moderator/moderator-login.html',
  	controller: 'ModeratorLoginController',
    controllerAs: 'ModLogCtrl'
  })
  .when('/newVote', {
  	templateUrl:'/templates/vote/vote-add.html',
  	controller: 'CreateNewVote',
    controllerAs: 'voteCtrl'
  })
  .when('/votes', {
  	templateUrl:'/templates/vote/votes-show.html',
  	controller: 'ShowVotesController',
    controllerAs: 'showVotesCtrl'
  })
  .when('/voteDetail/:id', {
  	templateUrl: '/templates/vote/vote-detail.html',
  	controller: 'VoteDetailController',
  	controllerAs: 'VoteDetCtrl'
  })
  .when('/voteEdit/:id', {
  	templateUrl: '/templates/vote/vote-edit.html',
  	controller: 'VoteEditController',
  	controllerAs: 'VoteEditCtrl'
  })
  .when('/myvotes/:id', {
  	templateUrl:'/templates/moderator/moderator-votes.html',
  	controller: 'ModeratorVotesController',
    controllerAs: 'ModVoteCtrl'
  })
  .when('/about/voteapp', {
  	templateUrl:'/templates/about/app-info.html',
  	controller: 'AppInfoController',
    controllerAs: 'AppInfoCtrl'
  })
  .when('/about/experience', {
  	templateUrl:'/templates/about/experience-info.html',
  	controller: 'ExperienceController',
    controllerAs: 'ExperienceCtrl'
  })
  .when('/about/education', {
  	templateUrl:'/templates/about/education-info.html',
  	controller: 'EducationController',
    controllerAs: 'EducationMeCtrl'
  })
  .when('/', {
  	redirectTo: '/votes'
  })
});

// Services
app.factory("Moderator", function($resource){
	return $resource("http://localhost:8080/voteapp/moderator/:id");
});

app.factory("Vote", function($resource){
	return $resource("http://localhost:8080/voteapp/votes/:id");
});


// Filters
app.filter('datetime', function($filter)
{
 return function(input)
 {
  if(input == null){ return ""; } 
 
  var _date = $filter('date')(new Date(input),
                              'MMM dd yyyy - HH:mm:ss');
 
  return _date.toUpperCase();

 };
});


// Controllers
app.controller('ModeratorLoginController', function($scope, $location, $http){

	$scope.moderator = {};

	$scope.loginForm = function(){

		var URL = 'http://localhost:8080/voteapp/moderator/' + $scope.moderator.moderator_id + '/login';
		$http({
			method: 'GET',
			url: URL
		})
		.success(function(data){
			if($scope.moderator.password.localeCompare(data.password) == 0)
			{
				var mypath = '/myvotes/' + $scope.moderator.moderator_id;
				$location.path(mypath);
			}
			else
			{
				swal("Wrong Password!", "Please Try Again.", "error");
				$scope.moderator = {};
			}
		})
		.error(function(data){
			swal("User doesn't exist!!", "Sign Up to login.", "error");
			$scope.moderator = {};
		});
	};
});


app.controller('ShowVotesController', function($scope, Vote, $http){
	
	$scope.votes = {};
	$scope.current = new Date().getTime();
	Vote.query(function(data){
		$scope.votes = data;
	});

	$scope.registerVote = function(vote, choice){
		
		var URL = 'http://localhost:8080/voteapp/vote/' + vote.vote_id + '?choice=' + choice;
		$http({
			method: 'PUT',
			url: URL,
			headers: {"Accept": "application/json, text/plain, */*"}
		})
		.success(function(data){
			swal(data.message, "", "success");
		})
		.error(function(data){
			swal(data.message, "", "error");
		});
	};
});

app.controller('VoteDetailController', function($scope, $routeParams, $http){

	$scope.vote = {};
	$scope.voteId = $routeParams.id;
	$scope.current = new Date().getTime();

	var URL = 'http://localhost:8080/voteapp/vote/' + $scope.voteId;
	$http({
			method: 'GET',
			url: URL
		})
		.success(function(data){
			$scope.vote = data;
		})
		.error(function(data){
			swal("Unable to gather vote details", "", "error");
		});

	$scope.registerVote = function(vote, choice){
		
		var URL = 'http://localhost:8080/voteapp/vote/' + vote.vote_id + '?choice=' + choice;
		$http({
			method: 'PUT',
			url: URL,
			headers: {"Accept": "application/json, text/plain, */*"}
		})
		.success(function(data){
			swal(data.message, "", "success");
		})
		.error(function(data){
			swal(data.message, "", "error");
		});
	};
})

app.controller('ModeratorVotesController', function($scope, $http, $routeParams, $route, $location){

	$scope.votes = {};
	$scope.moderator = $routeParams.id;
	var URL = 'http://localhost:8080/voteapp/moderator/' + $scope.moderator + '/vote';
	$http({
			method: 'GET',
			url: URL
		})
		.success(function(data){
			$scope.votes = data;
			if (data.length == 0)
			{
				swal("You currently have no votes registered");
			}
		})
		.error(function(data){
			swal("Moderator with ID " + $scope.moderator + " does not exists", "", "error");
			$location.path('/votes');
		});

	$scope.deleteVote = function(vote){
		
		var URL = 'http://localhost:8080/voteapp/moderator/' + $scope.moderator + '/vote/' + vote.vote_id;
		$http({
			method: 'DELETE',
			url: URL
		})
		.success(function(data){
			swal(data.message, "", "success");
			$route.reload();
		})
		.error(function(data){
			swal(data.message, "", "error");
		});
	};

	$scope.voteResult = function(voteId){
		
		var URL = 'http://localhost:8080/voteapp/vote/' + voteId + '/result';
		$http({
			method: 'GET',
			url: URL
		})
		.success(function(data){

			swal({   title: "<h3>Result</h3>",   
				text: "<strong>Yes: </strong>" + data.yes_count + "&nbsp; &nbsp; &nbsp; &nbsp;<strong>No: </strong>" +  data.no_count,   
				html: true });
		})
		.error(function(data){
			swal({   title: "<h3>Result</h3>",   
				text: "<strong>Yes: </strong>" + 0 + "&nbsp; &nbsp; &nbsp; &nbsp;<strong>No: </strong>" +  0,   
				html: true });
		});
	};
});

app.controller('CreateNewModerator', function($scope, Moderator, $location){

	$scope.moderator = {};

	$scope.submitForm = function(){
		
		Moderator.save($scope.moderator, 
			function(data){
				swal(data.message, "", "success");
				$location.path('/newVote');
			}, function(data){
			swal(data.data.message, "", "error");
		});
	};
});

app.controller('CreateNewVote', function($scope, $http, $location){

	$scope.vote = {};
	
	$scope.submitForm = function(){
		
		var moderator = $scope.vote.moderator_id;
		var voteInfo = {
		title: $scope.vote.title,
		description: $scope.vote.description,
		start_date: $scope.vote.start_date,
		end_date: $scope.vote.end_date
		};

		var URL = 'http://localhost:8080/voteapp/moderator/' + moderator + '/vote';
		$http({
			method: 'POST',
			url: URL,
			data: voteInfo,
			headers: {'Content-Type': 'application/json; charset=utf-8'}
		})
		.success(function(data){
			swal(data.message, "", "success");
			$location.path('/votes');
		})
		.error(function(data){
			swal(data.message, "", "error");
			$location.path('/newModerator');
		});
	};
});

/*app.controller('VoteEditController', function($scope, $http, $location, $routeParams){

	$scope.voteId = $routeParams.id;
	$scope.vote = {};

	var URL = 'http://localhost:8080/voteapp/vote/' + $scope.voteId;
	$http({
			method: 'GET',
			url: URL
		})
		.success(function(data){
			$scope.vote = data;
			console.log($scope.vote);
		})
		.error(function(data){
			swal("Unable to gather vote details", "", "error");
		});


});*/
