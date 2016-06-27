var app = angular.module('flapperNews', ['ui.router']);

app.controller('MainCtrl', [
	'$scope', 'posts',
	function($scope, posts){

		$scope.posts = posts.posts;
		
		$scope.addPost = function() {
			// !$scope.title checking for undefined 
			if (!$scope.title || $scope.title === '') {return;}
			$scope.posts.push({title: $scope.title, link: $scope.link,
				upvotes: 0});
			$scope.title = '';
			$scope.link = '';
		};

		$scope.incrementUpvotes = function(post) {
			post.upvotes += 1;
		}

}]);

app.factory('posts', [function() {

	var posts = [
		{title: 'post 1', upvotes: 5,
			comments: [{author: 'Joe', body: 'Cool post!', upvotes: 0},
			{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}]},
		{title: 'post 2', upvotes: 2},
		{title: 'post 3', upvotes: 15},
		{title: 'post 4', upvotes: 9},
		{title: 'post 5', upvotes: 4}
	];

	var o = {
		posts: posts
	};

	return o; 
}]);

app.controller('PostsCtrl', [
	'$scope', '$stateParams', 'posts',
	function($scope, $stateParams, posts){

		$scope.post = posts.posts[$stateParams.id];

		$scope.addComment = function() {
			if (!$scope.body || $scope.body === '') {return;}

			$scope.post.comments.push({
				author: 'user',
				body: $scope.body,
				upvotes: 0
			});

			$scope.body = '';
		};	
}]);

app.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl'
			})
			.state('posts', {
				// route paramater that will be made available
				// to our controller
				url: '/posts/{id}',
				templateUrl: '/posts.html',
				controller: 'PostsCtrl'
			});
		$urlRouterProvider.otherwise('home');
}]);