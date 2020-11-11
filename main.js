function checkStatus() {
	var statusDiv = document.getElementById("onair");

	// Get's current status of radio stream
	const req = new XMLHttpRequest();
	req.open('GET', 'https://public.radio.co/stations/sdb074d425/status');
	req.responseType = 'json';

	/* This function gets 2 main things:
		- (1) the status of the radio stream
		- (2) the name of the current playing track (if stream == online)
	*/
	req.onload = function(e) {
		if (this.status == 200) {
			let x = this.response;
			let player = $('.radioplayer').radiocoPlayer();

		    console.log(x.status);
		    console.log(x.current_track.title);
			let song_name = x.current_track.title,
				song_pos = document.getElementById("song-name");

		    if (x.status == "offline") {
				alert("Stream Offline, check schedule for next broadcast time");
				song_pos.innerHTML = "";
				window.location.reload(true);
		    }

		    if (x.status == "online") { 
		    	onAir(song_name);
		    	// Adds event listener, to change the track title
    			player.event('songChanged', function(e){
					console.log(e.trackTitle);
					
					var i = 0, speed = 40;

					document.getElementById('song-name').innerHTML = '';

					function typeWriter() {
						if (i < e.trackTitle.length) {
							document.getElementById('song-name').innerHTML += e.trackTitle.charAt(i);
							i++;
							setTimeout(typeWriter, speed);
						}
					}
					typeWriter();
					return;
				});
		    }
		}
	};

	// Sends the request to Radio.co's API
	req.send();
}

/*	This function changes the onair element (which is just a picture of some text,
	 saying 'OnAir') from invisible to visible. Once this is done,
	 the (now visible) onair indicator's opacity slowly blinks (fade.js)
	 Alongside this, it takes the current song name, and writes it in the bottom left corner
*/
function onAir(song_name) {
	let i = 0,
		speed = 40,
		isPlaying = document.getElementById('onair');

	// This if-else sets the onair indicator to display if music is playing
	if (isPlaying.style.display == "block") {	// If onair is visible
		isPlaying.style.display = "none";	
		document.getElementById("song-name").innerHTML = "";
		window.location.reload(true);
	} else {
		isPlaying.style.display = "block"; // Make visible

		// This function will display the currently playing song in a typewriter-esque fashion
		function typeWriter() {
			if (i < song_name.length) {
				document.getElementById("song-name").innerHTML += song_name.charAt(i);
				i++;
				setTimeout(typeWriter, speed);
			}
		}
		typeWriter();
	}
}
/*
	If stream is offline, don't display 'onAir' when play button is clicked
	Instead, inform user that the stream isn't going to start, as the braodcast isn't live

	If stream is online:
		- (1) Display onair sign when play button is clicked
		- (2) Play music
		- (3) Store song name
		- (4) Use song name in further calculations
*/
