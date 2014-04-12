

var Card = function(settings){
    this.title = settings.title;
    this.location = settings.location;
    this.poi = setting.poi;
    this.time = setting.time;
    this.detail = setting.detail;
}


// /tourlist/api/searchdpshop?query={"keyword":"中山公园","category":["美食","休闲娱乐"]}
// /tourlist/api/searchdpshop?query={
//     keyword:
//     category:
// }
// /tourlist/api/nearbydpshop?query={"latitude":"31.21524","longitude":"121.420033","category":"美食"}

// /tourlist/api/add
//     : id

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

app.factory("SearchService",["$http", function($http){
    return {
        get: function(opt){
            opt = opt || {};
            var data = {
                "category": opt.category,
                "keyword": opt.keyword
            };
            return $http.get("/tourlist/api/searchdpshop",{
                params: {
                    query: JSON.stringify(data)
                }
            });
        },
        nearby: function(opt){
            opt = opt || {};
            var latlng = opt.latlng;
            var data = {
                "latitude": latlng.lat,
                "longitude": latlng.lng,
                "category": opt.category
            }
            return $http.get("/tourlist/api/nearbydpshop",{
                params: {
                    query: JSON.stringify(data)
                }
            });
        }
    }
}]);


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