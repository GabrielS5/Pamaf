window.onload = function() {
    document.getElementById('username').value = window.localStorage.getItem('userName');

    if (!window.localStorage.getItem('year')) getLastYear(id);
    
    document.getElementById('year').value = window.localStorage.getItem('year');
    
    document.getElementById('save-button').addEventListener('click', function(e) {
        let newUsername = document.getElementById("username").value;
        changeName(window.localStorage.getItem("userId"), newUsername);

        let newYear = document.getElementById("year").value;
        window.localStorage.setItem("year", newYear);
	});
};
