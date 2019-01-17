<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Blind test getter</title>
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="node_modules/font-awesome/css/font-awesome.min.css">
</head>
<body>
<div id="header">

</div>
<div id="body">

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
                                App.init(true);
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