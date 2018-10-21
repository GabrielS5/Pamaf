var avatarMenuVisible = false;

window.onload = function() {
    document.getElementById('avatar').addEventListener('click', function (e) {
        if(avatarMenuVisible) {
            document.getElementById("avatar-menu").classList.add("hidden");
        }
        else {
            document.getElementById("avatar-menu").classList.remove("hidden");
        }
        avatarMenuVisible = !avatarMenuVisible;
    });

    document.getElementById('logout').addEventListener('click', function (e) {
        console.log("User logged out");
    });
  };
