$("#post").click(function(e){
    e.preventDefault();

	// Replace localhost and the folder name
	// based on your setup
	// location.href = 'http://localhost/jsredirect/home.html';
    location.href='http://127.0.0.1:5500/frontend/login.html';
})