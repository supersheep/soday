var app = angular.module("soday", []);
app.controller("PreviewController", ["$scope", "$http",
	function($scope, $http) {
		$scope.planId = location.href.match(/plans\/(\d+)/)[1];

		$scope.getPDF = function getPdf() {
			window.open('http://www.html2pdf.it/?url='+window.location.href);
		}

		$scope.edit = function() {
			window.open('/plans/' + $scope.planId + '/edit');
		}

		$http.get('/tourlist/api/' + $scope.planId)
			.success(function(data) {
				$scope.title = data.title;
				$scope.date = data.date;
				$scope.cards = data.cards;
			})
	}
]);