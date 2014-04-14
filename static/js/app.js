// /tourlist/api/searchdpshop?query={"keyword":"中山公园","category":["美食","休闲娱乐"]}
// /tourlist/api/searchdpshop?query={
//     keyword:
//     category:
// }
// /tourlist/api/nearbydpshop?query={"latitude":"31.21524","longitude":"121.420033","category":"美食"}

// /tourlist/api/add
//     : id
var app = angular.module("soday",[]);

app.directive("map",["$rootScope",function($rootScope){
    return {
        restrict:"E",
        template:"<div id='{{mapId}}'><div class='map-cont'></div></div>",
        replace: true,
        scope:{
            zoom:"=",
            center:"=",
            mapId:"@"
        },
        link: function(scope, elem, attrs){
            console.log(scope.center,scope.zoom)
            $rootScope.map = new DPMap.maps.Map(elem.find(".map-cont").get(0), {
                center: new DPMap.maps.LatLng(scope.center[0],scope.center[1]),
                zoom: scope.zoom,
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
    }
}]);


app.factory("SearchService",["$http","$q", function($http, $q){
    return {
        search: function(opt){
            var deferred = $q.defer();
            opt = opt || {};
            var latlng = opt.latlng;
            var params = {
                "category": opt.category
            };
            if(opt.keyword){
                params.keyword = opt.keyword;
            }
            if(latlng){
                params.latitude = latlng.lat;
                params.longitude = latlng.lng;
            }
            $http.get("/tourlist/api/searchdpshop",{
                params: params
            }).then(function(res){
                var data = res.data.map(function(item){
                    return {
                        rating_img: item.rating_s_img_url,
                        title: item.name,
                        addr: item.address,
                        // latlng: new DPMap.maps.LatLng(item.latitude, item.longitude),
                        latlng: [item.latitude,item.longitude],
                        tags: item.categories,
                        url: item.business_url,
                        price: item.avg_price,
                        photoUrl: item.s_photo_url,
                        tel: item.telephone
                    }
                });
                deferred.resolve(data);
            },function(){
                deferred.reject();
            });
            return deferred.promise;
        }
    }
}]);



app.controller("SodayCtrl",["$scope","$rootScope","SearchService","$timeout","$http",function($scope,$rootScope, SearchService, $timeout, $http){
    $scope.id = +location.href.match(/plans\/(\d+)/)[1];
    $scope.title = null;
    $scope.date = null
    $scope.keyword = "中山公园";
    $scope.cards = [{
        mod: "add"
    }];

    $http.get("/tourlist/api/" + $scope.id).then(function(resp){
        var data = resp.data
        $scope.title = data.title;
        $scope.date = data.date;
        $scope.cards = (data.cards || []).concat($scope.cards);
    });

    $scope.winHeight = $(window).height();

    $scope.mapCenter = [31.1789,120.9];
    $scope.mapZoom = 10;


    $scope.options = [];
    $scope.loading = false;
    $scope.selecting = false;
    $scope.currentCard = $scope.cards[0];

    $scope.category = "美食";
    $scope.categories = ["美食","休闲娱乐"];

    var optionsMarkers = [];
    var cardMarkers = [];

    function adjustBounds(markers){
        var map = $rootScope.map;
        var bounds = new DPMap.maps.LatLngBounds();
        markers.forEach(function (marker) {
            var latlng = marker.getPosition();
            bounds.extend(latlng);
        });
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
    }

    function addOptionMarker(latlng){
        var map = $rootScope.map;
        var marker = new DPMap.maps.Marker({
            map: map, // a map instance
            position: new DPMap.maps.LatLng(latlng[0],latlng[1])
        });
        optionsMarkers.push(marker);
    }

    function addCardMarker(latlng){
        var map = $rootScope.map;
        var marker = new DPMap.maps.Marker({
            map: map, // a map instance
            position: new DPMap.maps.LatLng(latlng[0],latlng[1])
        });
        cardMarkers.push(marker);
    }

    $scope.search = function(keyword){
        keyword = keyword || $scope.keyword;
        var params = {
            category: $scope.category,
            keyword: keyword
        };

        if($scope.lat && $scope.lng){
            params.latlng = {
                lat: $scope.lat,
                lng: $scope.lng
            }
        }
        $scope.loading = true;
        $scope.selecting = true;
        $scope.options.length = 0;
        SearchService.search(params).then(function(data){
            $scope.options = data;
            $scope.loading = false;
        },function(){
            $scope.loading = false;
        });
    }

    $scope.$watch("options.length",function(){
        $scope.updateMarkers();
    });

    $scope.select = function(card){
        angular.extend($scope.currentCard,card);
        $scope.currentCard.mod = "view";
        $scope.options.length = 0;
        $scope.selecting = false;
        $scope.keyword = "";
        addCardMarker(card.latlng);
    }

    $scope.updateMarkers = function(){
        var map = $rootScope.map
        optionsMarkers.forEach(function(marker){
            marker.setMap(null);
        });
        optionsMarkers = [];
        $scope.options.forEach(function(item){
            addOptionMarker(item.latlng);
        });
        // auto zoom
        if(optionsMarkers.length){
            map && adjustBounds(optionsMarkers);
            // map && map.panBy(-650,-100);
        }else{
            map && adjustBounds(cardMarkers);
            // map && map.panBy(-450,-100);
        }
    }
    $scope.remove = function(index){
        var card = $scope.cards[index];
        $scope.cards.split()
    }
    $scope.add = function(index){
        var cards = $scope.cards;
        if($scope.currentCard.mod === "view"){
            var newCard = {
                mod:"add"
            };
            cards.push(newCard);
            $scope.currentCard = newCard;
            $timeout(function(){
                $(".search-input").last().get(0).focus();
            });
        }
    }

    $scope.save = function(){
        console.log($scope);
        $http.put("/tourlist/api/" + $scope.id,{
            title: $scope.title,
            date: $scope.date,
            cards: $scope.cards
        }).then(function(){
            console.log("saved");
        });
    }

    $scope.search();

}]);