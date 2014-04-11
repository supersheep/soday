

var Card = function(settings){
    this.title = settings.title;
    this.location = settings.location;
    this.poi = setting.poi;
    this.time = setting.time;
    this.detail = setting.detail;
}



function initAside(){

}

function initMap(){
    var latlng = new DPMap.maps.LatLng(31.21789, 121.41403);
    console.log(latlng);
    this.map = new DPMap.maps.Map($("#map").get(0), {
        center: latlng,
        zoom: 10,
        mapTypeId: DPMap.maps.MapTypeId.ROADMAP,
        panControlOptions:{
            position: DPMap.maps.ControlPosition.TOP_RIGHT
        },
        zoomControlOptions: {
            position: DPMap.maps.ControlPosition.RIGHT_TOP,
            style:DPMap.maps.ZoomControlStyle.SMALL
        }
    });
}


var app = angular.module("soday",[]);

app.controller("SodayCtrl",["$scope","$http",function($scope,$http){
    $scope.title = "钱满和嘟嘟的周末";
    $scope.date = "2014-04-12";
    $scope.cards = [{
        mod: "add"
    }];

    $scope.options = [];
    $scope.loading = false;

    $scope.search = function(){
        var keywords = $scope.keywords;
        $scope.loading = true;
        $scope.options = $http.get("/api/activities").then(function(){
            $scope.loading = true;
        });
    }

    $scope.addAfter = function(index){
        var cards = $scope.cards;
        var before = cards.split(0,index);
        $scope.cards = before.concat({
            mod:"add"
        }).concat(cards);
    }
    $scope.addBeforeFirst = function(){
        $scope.cards.unshift({
            mod:"add"
        });
    }

}]);

initMap();