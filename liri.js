require("dotenv").config();

// variables to run node packages
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");//links api keys file
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var value = "";


//reads the input from user and routes
switch (command) {
    case "my-tweets":
        getTweets();
        break;
    case "spotify-this-song":
        getArguments(process.argv);
        getSpotifySong(value);
        break;
    case "movie-this":
        getArguments(process.argv);
        var omdbApi = "http://www.omdbapi.com/?apikey=trilogy&t=";
        getMovie(omdbApi, value);
        break;
    case "do-what-it-says":
        doWhatItSays(); 
        break;
};

//gets the total users imput after the command
// movie title, song name and returns the value
function getArguments(process) {
    for (var i = 3; i < process.length; i++) {
        if (i > 3 && i < process.length) {
            value = value + "+" + process[i];
        } else {
            value = value + process[i];
        }
    }

    return value;
}

//returns the last 20 tweets my-tweets
function getTweets() {
    client.get("statuses/user_timeline/", function (error, tweets, response) {
        for (var i = 0; i < 20; i++) {
            var twitterResults =
                "\r\n@" + tweets[i].user.screen_name + " - " +
                tweets[i].text + "\r\n" +
                tweets[i].created_at + "\r\n";
            console.log(twitterResults);
        }
    });
}

//returns the user entered song, if no song is entered it returns song
//The Sign
function getSpotifySong(songName) {
    if (!songName) {
        songName = "The Sign";
    }

    //list of song information data returned from the Spotify api
    spotify.search({ type: 'track', query: songName }, function (err, data) {
        for (var i = 0; i < 1; i++) {
            var results =
                "\r\n" +
                data.tracks.items[0].artists[0].name + "\r\n" +
                data.tracks.items[0].name + "\r\n" +
                data.tracks.items[0].album.name + "\r\n" +
                data.tracks.items[0].preview_url + "\r\n";
            console.log(results);
        }
    });
};

//returns the user entered movie , if no movie returns the movie
//Mr Nobody
function getMovie(omdbApi, movie) {
    if (!movie) {
        movie = "Mr. Nobody";
    }
    //list of movie information data returned from OMDB api
    request(omdbApi + movie, function (error, response, body) {
        var movieObject = JSON.parse(body);
        var movieResults =
            "\r\n" +
            movieObject.Title + "\r\n" +
            movieObject.Year + "\r\n" +
            movieObject.imdbRating + "\r\n" +
            movieObject.Ratings[1].Value + "\r\n" +
            movieObject.Country + "\r\n" +
            movieObject.Language + "\r\n" +
            movieObject.Plot + "\r\n" +
            movieObject.Actors + "\r\n";
        console.log(movieResults);
    });
}

//Read text from the random.txt and run the command 
//based on what is in the file
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        data = data.split(',');

        var fileCommand;
        var fileParameter;

        if (data.length == 2) {
            fileCommand = data[0];
            fileParameter = data[1];
        }

        fileParameter = fileParameter.replace('"', '');

        switch (fileCommand) {
            case 'my-tweets':
                value = fileParameter;
                getTweets();
                break;

            case 'spotify-this-song':
                value = fileParameter;
                getSpotifySong(value);
                break;

            case 'movie-this':
                value = fileParameter;
                getMovie();
                break;
        }
    });
}