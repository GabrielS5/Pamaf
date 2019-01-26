window.onload = function () {
    //document.getElementById('fb-button').addEventListener('click', function(e) {
    //       login("1", "Gabao");
    //   });

    document.getElementById('guestLogin').addEventListener('click', function (e) {
        guestLogin();
    });
};

window.fbAsyncInit = function () {
    FB.init({
        appId: '350115898912228',
        cookie: true,
        xfbml: true,
        version: 'v3.2'
    });


    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });

};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {
    if (response.status === 'connected') {
        console.log('Logged in and authenticated');
        //Aici redirectionare catre pagina ca si logat
        getUserId();
        getUserFriends();
        getUserProfilePic();
    }
    else {
        console.log('Not authenticated');
    }
}


function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

function getUserId() {
    FB.api('/me?fields=id', function (response) {
        if (response && !response.error) {
            console.log(response.id);
        }
    })
}

function getUserFriends() {
    FB.api('/me?fields=friends', function (response) {
        if (response && !response.error) {
            console.log(response.friends);
        }
    })
}

function getUserProfilePic() {
    FB.api('/me?fields=picture', function (response) {
        if (response && !response.error) {
            console.log(response.picture);
        }
    })
}