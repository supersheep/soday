var app = angular.module("soday", []);
app.controller("PreviewController", ["$scope", "$timeout",
	function($scope, $timeout) {
		$scope.getPDF=function getPdf() {
			window.open('http://www.html2pdf.it/?url=https://github.com/Muscula/html2pdf.it')
		}
	}
]);