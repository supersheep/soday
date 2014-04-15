var app = angular.module("soday", []);
app.controller("PreviewController", ["$scope", "$http",
	function($scope, $http) {
		$scope.planId = location.href.match(/plans\/(\d+)/)[1];

		$scope.getPDF = function getPdf() {
			window.open('http://www.html2pdf.it/?url=' + window.location.href);
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

		$scope.calculateDistance = function distance(latlng1, latlng2, unit) {
			if(!latlng2 || !latlng1){
				return '';
			}
			var radlat1 = Math.PI * latlng1[0] / 180;
			var radlat2 = Math.PI * latlng2[0] / 180;
			var radlon1 = Math.PI * latlng1[1] / 180;
			var radlon2 = Math.PI * latlng2[1] / 180;
			var theta = latlng1[1] - latlng2[1];
			var radtheta = Math.PI * theta / 180;
			var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			dist = Math.acos(dist);
			dist = dist * 180 / Math.PI;
			dist = dist * 60 * 1.1515;
			if (unit == "K") {
				dist = dist * 1.609344;
			}
			if (unit == "N") {
				dist = dist * 0.8684;
			}
			return dist.toFixed(2);
		}

	}
]);