<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Blind test application</title>
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
</head>
<body>
<style>
    #body h1 {
        text-align:center;
        background-color: black;
        color: white;
        padding: .5em;
        margin:0;
    }

    #cover, #cover > img {
        width: 1000px;
        height: 1000px;
    }

    #player > a {
        display: block;
    }
</style>
<div id="header">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="index.html">Blind Test</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle"
                       href="#"
                       id="navbarDropdown"
                       role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Choisir test...
                    </a>
                    <div id="test-list" class="dropdown-menu" aria-labelledby="navbarDropdown">

                    </div>
                </li>
            </ul>
            <form class="form-inline my-2 my-lg-0">
                <label for="show-answers">
                    <input id="show-answers" type="checkbox" value="">
                    Voir réponses
                </label>
            </form>
        </div>
    </nav>

</div>
<div id="body">

    <h1 id="playlist-title"></h1>
    <h4 id="playlist-rules"></h4>
    <div class="row">
        <div class="col-md-2">
            <ul id="player" class="test">
            </ul>
        </div>
        <div class="col-md-10" id="test-panel">
            <h2>
                <span class="nr"></span>
                <span class="nr-sep"></span>
                <span class="author"></span>
                <span class="title-sep"></span>
                <span class="title"></span>
            </h2>
            <h4 class="extra">

            </h4>
            <div id="cover"></div>
        </div>
    </div>
</div>
<div id="dz-root"></div>
<script type="text/javascript" src="node_modules/jquery/dist/jquery.js"></script>
<script type="text/javascript" src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
<script src="dz.js"></script>
<script src="data.js"></script>
<script src="bt.js"></script>
</body>
</html>