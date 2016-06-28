var app = angular.module('flapperNews', ['ui.router']);

app.controller('MainCtrl', [
	'$scope', 'posts',
	function($scope, posts){

		$scope.posts = posts.posts;
		
		$scope.addPost = function() {
			// !$scope.title checking for undefined 
			if (!$scope.title || $scope.title === '') {return;}
			// $scope.posts.push({title: $scope.title, link: $scope.link,
			// 	upvotes: 0});
			posts.create({
				title: $scope.title,
				link: $scope.link
			});

			$scope.title = '';
			$scope.link = '';
		};

		$scope.incrementUpvotes = function(post) {
			posts.upvote(post);
		}

}]);

app.factory('posts', ['$http', function($http) {

	var o = {
		posts: []
	};

	o.getAll = function() {
		return $http.get('/posts').success(function(data) {
			angular.copy(data, o.posts);
		});
	};

	o.create = function(post) {
		return $http.post('/posts', post).success(function(data) {
			o.posts.push(data);
		});
	};

	o.upvote = function(post) {
		return $http.put('/posts/' + post._id + '/upvote')
			.success(function(data) {

				// when the call returns succesfully, we update
				// our local copy to reflect the changes
				post.upvotes += 1; 
			});
	};

	o.get = function(id) {
		return $http.get('/posts/' + id).then(function(res) {
			return res.data;
		});
	};

	o.addComment = function(id, comment) {
		return $http.post('/posts/' + id + '/comments', comment);
	};

	o.upvoteComment = function(post, comment) {
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
			.success(function(data) {
				// when the call returns succesfully, we update
				// our local copy to reflect the changes
				comment.upvotes += 1
			})
	}
	return o; 
}]);

app.controller('PostsCtrl', [
	'$scope', 'posts', 'post',
	function($scope, posts, post){

		// $scope.post = posts.posts[$stateParams.id];
		$scope.post = post;

		$scope.addComment = function() {
			if (!$scope.body || $scope.body === '') {return;}

			// $scope.post.comments.push({
			// 	author: 'user',
			// 	body: $scope.body,
			// 	upvotes: 0
			// });

			posts.addComment(post._id, {
				body: $scope.body,
				author: 'user',
			}).success(function(comment) {
				// when the call returns succesfully, we update
				// our local copy to reflect the changes
				$scope.post.comments.push(comment);
			});

			$scope.body = '';
		};

		$scope.incrementUpvotes = function(comment) {
			posts.upvoteComment(post, comment);
		};	
}]);

app.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl',
				resolve: {
					postPromise: ['posts', function(posts) {
						return posts.getAll();
					}]
				}
			})
			.state('posts', {
				// route paramater that will be made available
				// to our controller
				url: '/posts/{id}',
				templateUrl: '/posts.html',
				controller: 'PostsCtrl',
				resolve: {
					post: ['$stateParams', 'posts', function($stateParams, posts) {
						return posts.get($stateParams.id);
					}]
				}
			});
		$urlRouterProvider.otherwise('home');
}]);