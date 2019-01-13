let showAnswers = false;
$('#show-answers').on('click', function(e) {
    showAnswers = $(this).is(':checked');
});

let App = {
    playlists: playlists,
    stop: false,
    gap: 1, // nb seconds of gap between tracks
    unknownCover: 'unknown-cover.jpg',
    init: function() {
        for (let i in App.playlists) {
            console.log('Playlist', i, ': ', App.playlists[i]);
            DZ.api('/playlist/' + App.playlists[i].id, function(list) {
                console.log("Playlist", i, "data : ", list);
                App.playlists[i].nr = i;
                App.playlists[i].codename = list.title;
                App.playlists[i].trackIds = [];
                for (let j in list.tracks.data) {
                    let track = list.tracks.data[j];
                    App.playlists[i].trackIds[j] = track.id;
                    App.playlists[i].tracks[j].nr = j;
                    App.playlists[i].tracks[j].id = track.id;
                    App.playlists[i].tracks[j].duration = track.duration;
                    App.playlists[i].tracks[j].cover = track.album.cover_xl;

                    App.playlists[i].tracks[j].time = App.playlists[i].tracks[j].time || App.playlists[i].time;
                    App.playlists[i].tracks[j].start = App.playlists[i].tracks[j].start || App.playlists[i].start;
                    App.playlists[i].tracks[j].answer = App.playlists[i].tracks[j].answer || App.playlists[i].answer;
                }
                App._addToMenu(App.playlists[i]);
            });
            break;
        }
        console.log("Playlists data after : ", this.playlists);
        // Fill menu with
    },
    _addToMenu: function(playlist) {
        let $menu = $('#test-list');
        $menu.append(
            $('<a class="dropdown-item">')
                .html((Number.parseInt(playlist.nr) + 1) + '. ' + playlist.title)
                .prop('data-playlist-nr', playlist.nr)
                .on('click', App._populateTest)
        );
    },
    _populateTest: function(clickEvent) {
        console.log('entering _populateTest...');
        let $target = $(clickEvent.target),
            $player = $('#player');
        console.log('playlist number', $target.prop('data-playlist-nr'), 'selected');
        let playlist = App.playlists[$target.prop('data-playlist-nr')];
        console.log('populating playlist', playlist);
        $('#body').show();
        $('#test-panel').hide();

        $('#playlist-title').html((Number.parseInt(playlist.nr) + 1 ) + '. ' + playlist.title);
        $('#playlist-rules').html(playlist.rules);
        $player.html('');
        $player.append(
            $('<a class="btn btn-success">')
                .html('PLAY')
                .prop('data-playlist-nr', playlist.nr)
                .on('click', App._playList)
        );
        $player.append(
            $('<a class="btn btn-danger">')
                .html('STOP')
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
            playlist = App.playlists[$target.prop('data-playlist-nr')],
            fullDuration = 0;

        App.stop = false;
        console.log('run playlist', playlist.id, ' with pause');
        DZ.player.playPlaylist(playlist.id); // load tracks
        DZ.player.pause();
        App._playListTrack(playlist, 0);
    },
    _playListTrack: function(playlist, trackNr) {
        let track = playlist.tracks[trackNr];
        console.log('play track ', track.nr);

        let start = showAnswers ? track.answer : track.start,
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
        }, track.time * 1000);
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
        if (showAnswers) {
            $('#test-panel .nr').html(Number.parseInt(track.nr) + 1);
            $('#test-panel .nr-sep').html('. ');
            $('#test-panel .author').html(track.author);
            $('#test-panel .title-sep').html(' - ');
            $('#test-panel .title').html(track.title);
            if (!!track.show) {
                $('#test-panel.extra').html(track.show);
            }
            if (!!track.movie) {
                $('#test-panel.extra').html(track.movie);
            }
            if (!!track.year) {
                $('#test-panel.extra').html(track.year + ' (' + track.order + (track.order === 1 ? 'ère' : 'ème') + ' position)');
            }
            $('#cover').html('').append($('<img>').prop('src', track.cover));
        } else {
            this._hideTrackInfo();
            $('#test-panel .nr').html('Extrait n°' + (Number.parseInt(track.nr) + 1));
            $('#cover').html('').append($('<img>').prop('src', this.unknownCover));
        }
    },
    _hideTrackInfo: function() {
        $('#test-panel .nr').html('');
        $('#test-panel .nr-sep').html('');
        $('#test-panel .author').html('');
        $('#test-panel .title-sep').html('');
        $('#test-panel .title').html('');
        $('#test-panel .extra').html('');
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

/*

const populateTrack = function(track, trackNumber, defaultDuration) {
    console.debug('track #' + trackNumber, track, defaultDuration);
    track.number = trackNumber;
    if (!track.duration) {
        track.duration = defaultDuration;
    }
    let trackLink = $('<a>')
        .html(trackNumber)
        .prop('href', '#')
        .prop('data-track', JSON.stringify(track))
        .on('click', runTest)
    ;
    let trackEntry = $('<li>')
        .append(trackLink)
    ;
    $('.test').append(trackEntry);
};
const runTrack = function(trackData) {
    console.debug('runTrack:', trackData);
    let $track = $('.track'),
        $number = $('.track .number'),
        $title =  $('.track .title'),
        $author = $('.track .author'),
        $separators = $('.track .separator'),
        $cover = $('.cover-container'),
        $timer = $('.timer');
    if (showAnswers) {
        $separators.show();
        $number.html(trackData.number);
        $title.html(trackData.title);
        $author.html(trackData.author);
        $cover.html('').append($('<img>').addClass('cover').prop('src', 'mellon-collie.jpg'));
    } else {
        $separators.hide();
        $cover.addClass('unknown');
        $cover.prop('src', '');
        $number.html('Extrait ' + trackData.number);
        $title.html('');
        $author.html('');
    }
    $timer.html(trackData.duration);
};
const runTest = function(clickEvent) {
    let target = clickEvent.target, $target = $(target);
    if ($target.prop('data-track')) {
        // run specific track
        runTrack(JSON.parse($target.prop('data-track')));
        return;
    }

    // run all tracks
    //('.test a[data-track]').each(trackEntry, function() {

    //});
};
const populateTest = function(clickEvent) {
    $('#body').show();
    let target = clickEvent.target,
        $target = $(target);
    console.debug($target.prop('data-tracks'));
    let tracks = JSON.parse($target.prop('data-tracks'));
    console.debug('populateTest', target, tracks);
    const $test = $('.test');
    $('#playlist-title').html($target.prop('data-playlist-title'));

    $test.html('');
    let runTestLink = $('<a>')
        .html('ALL')
        .prop('href', '#')
        .on('click', runTest)
    ;
    $test.append(runTestLink);
    for(let i in tracks) {
        populateTrack(tracks[i], i + 1, $target.prop('data-duration'));
    }
};

// initialize !
$('#body').hide();
for(let i in data) {
    let test = $('<a>')
        .addClass('dropdown-item')
        .prop('href', '#')
        .html(data[i].title)
        .prop('data-playlist-title', data[i].title)
        .prop('data-playlist-number', i)
        .prop('data-duration', data[i].duration)
        .prop('data-tracks', JSON.stringify(data[i].tracks))
        .on('click', populateTest)
    ;
    $('#test-list').append(test);
}
*/