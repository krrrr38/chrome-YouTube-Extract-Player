var app = angular.module('player-app', []);

app.run(['PlayList', function(PlayList){
    var idQueries = location.search.match(/id=(.*?)\&/g);
    angular.forEach(idQueries, function(query, index) {
        var matcher = query.match(/id=(.*?)\&/);
        if (matcher) {
            PlayList.addVideo(matcher[1]);
        }
    });

    var script = document.createElement('script');
    script.src = "https://www.youtube.com/iframe_api";
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);
}]);

app.controller('PlayerController', ['$window', '$scope', 'Player', 'PlayList', function($window, $scope, Player, PlayList) {
    $scope.videos = PlayList.list;
    $scope.playVideo = function(index) {
        Player.playWithIndex(index);
    };
    Player.setPlayList(PlayList);
    $window.onYouTubeIframeAPIReady = function () {
        Player.start();
    };
}]);

app.factory('Player', function() {
    var self = {
        player: null,
        playList: null
    };
    self.setPlayList = function(playList) {
        self.playList = playList;
    };
    self.start = function (){
        if (!self.playList) return;
        self.play(self.playList.currentVideo());
    };
    self.play = function(id) {
        if (!self.player) {
            self.player = new YT.Player('player', {
                height: '240',
                width: '300',
                videoId: id,
                playerVars: {
                    autoplay: 1,
                    rel: 0
                },
                events: {
                    onStateChange: function(event) {
                        if(event.data == YT.PlayerState.ENDED) {
                            self.play(self.playList.nextVideo());
                        }
                    }
                }
            });
        } else {
            self.player.loadVideoById(id);
        }
    };
    self.playWithIndex = function(index) {
        self.playList.setIndex(index);
        self.player.loadVideoById(self.playList.currentVideo());
    };
    return self;
});

app.factory('PlayList', function(){
    var self = {
        list: [],
        index: 0
    };
    self.addVideo = function(id){
        self.list.push(id);
    };
    self.currentVideo = function(){
        return self.list[self.index];
    };
    self.nextVideo = function(){
        if(self.index + 1 >= self.list.length ) {
            self.index = 0;
        }else{
            self.index++;
        }
        return self.list[self.index];
    };
    self.setIndex = function(index) {
        self.index = index;
    };
    return self;
});
