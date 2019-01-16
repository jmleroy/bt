let App = {
    showAnswers: false,
    playlists: playlists,
    stop: false,
    gap: 1, // nb seconds of gap between tracks
    unknownCover: 'unknown-cover.jpg',
    init: function() {
        for (let i in App.playlists) {
            console.log('Playlist', i, ': ', App.playlists[i]);
            DZ.api('/playlist/' + App.playlists[i].id, function(list) {
                console.log("Playlist", i, "data : ", list);
                App.playlists[i].nr = Number.parseInt(i);
                App.playlists[i].codename = list.title;
                App.playlists[i].trackIds = [];
                for (let j in list.tracks.data) {
                    let track = list.tracks.data[j];
                    App.playlists[i].trackIds[j] = track.id;
                    App.playlists[i].tracks[j].nr = Number.parseInt(j);
                    App.playlists[i].tracks[j].id = track.id;
                    App.playlists[i].tracks[j].duration = track.duration;
                    App.playlists[i].tracks[j].cover = track.album.cover_xl;

                    App.playlists[i].tracks[j].time = App.playlists[i].tracks[j].time || App.playlists[i].time;
                    App.playlists[i].tracks[j].answerTime = App.playlists[i].tracks[j].answerTime || 2 * App.playlists[i].tracks[j].time;
                    App.playlists[i].tracks[j].start = App.playlists[i].tracks[j].start || App.playlists[i].start;
                    App.playlists[i].tracks[j].answer = App.playlists[i].tracks[j].answer || App.playlists[i].answer;
                }
            });
        }
        for (let i in App.playlists) {
            App._addToMenu(App.playlists[i], Number.parseInt(i));
        }
        console.log("Playlists data after : ", this.playlists);
        // Fill menu with
    },
    _addToMenu: function(playlist, nr) {
        let $menu = $('#test-list');
        console.log('add playlist', nr, 'to menu');
        $menu.append(
            $('<a class="dropdown-item">')
                .html((nr + 1) + '. ' + playlist.title)
                .prop('data-playlist-nr', nr)
                .on('click', App._populateTest)
        );
    },
    _toggleAnswers: function(clickEvent) {
        let $target = $(clickEvent.target),
            $icon = $($target.find('i'));
        if (App.showAnswers) {
            $icon.removeClass('fa-eye').addClass('fa-eye-slash');
            $target.removeClass('btn-outline-success').addClass('btn-outline-secondary');
            App.showAnswers = false;
        } else {
            $icon.removeClass('fa-eye-slash').addClass('fa-eye');
            $target.removeClass('btn-outline-secondary').addClass('btn-outline-success');
            App.showAnswers = true;
        }
        console.debug('showAnswers:', App.showAnswers);
    },
    _populateTest: function(clickEvent) {
        console.log('entering _populateTest...');
        let $target = $(clickEvent.target),
            $player = $('#player');
        console.log('playlist number', $target.prop('data-playlist-nr'), 'selected');
        let playlist = App.playlists[$target.prop('data-playlist-nr')];
        console.log('populating playlist', playlist);
        App.showAnswers = false;
        $('#body').show();
        $('#test-panel').hide();
        DZ.player.playPlaylist(playlist.id, false); // load tracks
        //DZ.player.pause();

        $('.playlist-title').show().html((Number.parseInt(playlist.nr) + 1 ) + '. ' + playlist.title);
        $('#playlist-rules').html(playlist.rules);
        $player.html('');
        $player.append(
            $('<a class="btn btn-outline-secondary">')
                .html('<i class="fa fa-eye-slash"></i>')
                .on('click', App._toggleAnswers)
        );
        $player.append(
            $('<a class="btn btn-success">')
                .html('<i class="fa fa-play"></i>')
                .prop('data-playlist-nr', playlist.nr)
                .on('click', App._playList)
        );
        $player.append(
            $('<a class="btn btn-danger">')
                .html('<i class="fa fa-stop"></i>')
                .prop('data-playlist-nr', playlist.nr)
                .on('click', App._stopList)
        );
        for (let i in playlist.tracks) {
            $player.append(
                $('<a class="btn btn-default">')
                    .html(Number.parseInt(playlist.tracks[i].nr) + 1)
                    .prop('data-playlist-nr', playlist.nr)
                    .prop('data-track-nr', playlist.tracks[i].nr)
                .on('click', App._playTrack)
            );
        }
    },
    _getSeekPosition: function(seconds, fullDuration) {
        return 100 * seconds / fullDuration;
    },
    _playList: function(clickEvent) {
        let $target = $(clickEvent.target),
            playlist = App.playlists[$target.prop('data-playlist-nr')];

        App.stop = false;
        console.log('run playlist', playlist.id, ' with pause');
        //DZ.player.playPlaylist(playlist.id); // load tracks
        //DZ.player.pause();
        // TODO: show transition 3, 2, 1 ...
        //window.setTimeout(function() {
        $('#test-panel .playlist-title').hide();
        App._playListTrack(playlist, 0);
        //}, App.gap * 1000);
    },
    _playListTrack: function(playlist, trackNr) {
        let track = playlist.tracks[trackNr];
        console.log('play track ', track.nr);

        let start = App.showAnswers ? track.answer : track.start,
            trackTime = App.showAnswers ? track.answerTime : track.time,
            seekPosition = App._getSeekPosition(start, track.duration);
        console.log('seek position ', start, ' with duration ', track.duration, ' = ', seekPosition);

        App._showTrackInfo(track);
        DZ.player.seek(seekPosition);
        DZ.player.play();

        window.setTimeout(function() {
            if (!App.stop) {
                DZ.player.pause();
                if (trackNr + 1 === playlist.tracks.length) {
                    console.log('end of playlist reached:', trackNr + 1)
                } else {
                    DZ.player.next();
                    DZ.player.pause();
                    console.log('set player to next track, wait 1s');
                    window.setTimeout(function() {
                        console.log('run next track');
                        App._playListTrack(playlist, trackNr + 1);
                    }, App.gap * 1000);
                }
            }
        }, trackTime * 1000);
    },
    _stopList: function(clickEvent) {
        let $target = $(clickEvent.target);
        App.stop = true;
        DZ.player.pause();
        App._hideTrackInfo();
    },
    _playTrack: function(clickEvent) {
        let $target = $(clickEvent.target);
        console.log('_playTrack : to be defined');
    },
    _showTrackInfo: function(track) {
        console.log('entering _showTrackInfo with track ', track);
        $('#test-panel').show();
        if (App.showAnswers) {
            $('#test-panel .nr').html(Number.parseInt(track.nr) + 1);
            $('#test-panel .nr-sep').html('. ');
            $('#test-panel .author').html(track.author);
            $('#test-panel .title-sep').html(' - ');
            $('#test-panel .title').html(track.title);
            if (!!track.show) {
                $('#test-panel .extra-show').html(track.show);
            }
            if (!!track.movie) {
                $('#test-panel .extra-movie').html(track.movie);
            }
            if (!!track.year) {
                $('#test-panel .extra-year').html(track.year);
                $('#test-panel .extra-order').html('(' + track.order + (track.order === 1 ? 'ère' : 'ème') + ' position)');
            }
        } else {
            this._hideTrackInfo();
            $('#test-panel .nr').html('Extrait n°' + (Number.parseInt(track.nr) + 1));
        }
        App._showCover(track);
    },
    _showCover: function(track) {
        //if (App.showAnswers) {
        //    $('#cover').html('').append($('<img>').prop('src', track.cover));
        //} else {
        //    $('#cover').html('').append($('<img>').prop('src', this.unknownCover));
        //}
        $('#cover').css('background-image', 'url(' + (App.showAnswers ? track.cover : this.unknownCover) + ')');
    },
    _hideTrackInfo: function() {
        $('#test-panel .nr').html('');
        $('#test-panel .nr-sep').html('');
        $('#test-panel .author').html('');
        $('#test-panel .title-sep').html('');
        $('#test-panel .title').html('');
        $('#test-panel .extra-show').html('');
        $('#test-panel .extra-movie').html('');
        $('#test-panel .extra-year').html('');
        $('#test-panel .extra-order').html('');
    },
    end: function() {}
};

const onPlayerLoaded = function(e) {
    console.log('Player loaded !');
};

DZ.init({
    appId  : '321362',
    channelUrl : 'http://blind.studio16.local/channel.php',
    player : {
        onload : onPlayerLoaded
    }
});

DZ.login(function(response) {
    if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');
        DZ.api('/user/me', function(response) {
            console.log('Good to see you, ' + response.name + '.');
            App.init();
        });
    } else {
        console.log('User cancelled login or did not fully authorize.');
    }
}, {perms: 'basic_access'});
