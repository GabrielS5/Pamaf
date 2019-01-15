window.onload = function() {
	document.getElementById('login').addEventListener('click', function(e) {
        login("1", "Gabao");
    });

    document.getElementById('guestLogin').addEventListener('click', function(e) {
        guestLogin();
    });
};
