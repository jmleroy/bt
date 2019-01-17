<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Blind test application</title>
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="node_modules/font-awesome/css/font-awesome.min.css">
</head>
<body>
<div id="header">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <style>

            #test-panel h2 {
                position:relative;
                width: 960px;
                background-color: rgba(0,0,0,.6);
                color: white;
                padding: .3em;
                margin:0;
            }
            #test-panel h2 * {
                font-size:2em;
            }
            #test-panel h4 {
                padding-right: 1em;
            }
            #test-panel h4 * {
                background-color: rgba(0,0,0,.6);
                color: white;
                position:relative; top:400px;
                font-size: 2em;
                display:block;
                right: 0;
                text-align:right;
            }
            #test-panel .author { color: yellow; text-align:right }
            #test-panel .title { color: lightcoral; display:block; }
            #test-panel .extra-show { display:block; }
            #test-panel .extra-movie { display:block; }
            #test-panel .title-sep { display:none; }
            #test-panel .extra-year { font-size:8em; }
            #test-panel .nr-alone { font-size:5em; padding-bottom: 2em; }
            #test-panel .extra-order { display:block; }
            #test-panel .rules { display:block; }

            #cover {
                width: 960px;
                height: 960px;
            }

            #player > a {
                display: block;
            }
        </style>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle"
                       href="#"
                       id="navbarDropdown"
                       role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-bars" aria-hidden="true"></i>
                    </a>
                    <div id="test-list" class="dropdown-menu" aria-labelledby="navbarDropdown">

                    </div>
                </li>
            </ul>
            <span class="navbar-text">
                <h4 class="playlist-title"></h4>
            </span>
        </div>
    </nav>

</div>
<div id="body">
    <h4 id="playlist-rules"></h4>
    <div class="row">
        <div class="col-md-2">
            <ul id="player" class="test">
            </ul>
        </div>
        <div class="col-md-10" id="test-panel">
            <div id="cover">
                <h2>
                    <span class="nr-alone"></span>
                    <span class="nr"></span>
                    <span class="nr-sep"></span>
                    <span class="author"></span>
                    <span class="title-sep"></span>
                    <span class="title"></span>
                    <span class="extra-show"></span>
                    <span class="extra-movie"></span>
                    <span class="rules"></span>
                </h2>
                <h4 class="extra">
                    <span class="extra-year"></span>
                    <span class="extra-order"></span>
                </h4>
            </div>
        </div>
    </div>
</div>
<div id="dz-root"></div>
<script type="text/javascript" src="node_modules/jquery/dist/jquery.js"></script>
<script type="text/javascript" src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
<script src="dz.js"></script>
<script src="data.js"></script>
<script src="bt.js"></script>
<script>
    $(document).ready(function() {
        DZ.init({
            appId  : '321362',
            channelUrl : 'http://blind.studio16.local/channel.php',
            player : {
                onload : function(playerStatus) {
                    console.log('Player loaded !');

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
                }
            }
        });
    });
</script>
</body>
</html>