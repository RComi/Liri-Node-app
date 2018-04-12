require("dotenv").config();

var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var value = "";

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
        doWhatItSays(); break;
};

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

function getTweets() {
    client.get("statuses/user_timeline/", function (error, tweets, response) {
        for (var i = 0; i < tweets.length; i++) {
            var twitterResults =
                "\r\n@" + tweets[i].user.screen_name + " - " +
                tweets[i].text + "\r\n" +
                tweets[i].created_at + "\r\n";
            console.log(twitterResults);
        }
    });
}

function getSpotifySong(songName) {
    if (!songName) {
        songName = "The Sign";
    }
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

function getMovie(omdbApi, movie) {
    if (!movie) {
        movie = "Mr. Nobody";
    }
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
};