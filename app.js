require("dotenv").config();
//this gets info from our environment file

const express = require("express");
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", async (req, res) => {
  res.render("home");
});

app.get("/artist-search", async (req, res) => {
  //Query param
  let artistName = req.query.theArtistName;
  try {
    let result = await spotifyApi.searchArtists(artistName);
    console.log("The received data from the API: ", result.body); //este console.log é para perceber
    //qual é a estrtura deste objecto vindo da api, para depois enviar para o frontend
    let artists = result.body.artists.items;
    /* artists.forEach((artist) => {
        console.log(artist) }); */
    console.log(artists);
    res.render("artist-search-results", { artists });
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  } catch (error) {
    console.log(error);
  }
});

app.get("/albums/:albumId", async (req, res, next) => {
  let result = await spotifyApi.getArtistAlbums(req.params.albumId);
  console.log(result);
  let albums = result.body.items;
  res.render("albums", { albums });
});

app.get("/tracks/:tracksId", async (req, res, next) => {
  let result = await spotifyApi.getAlbumTracks(req.params.tracksId);
  console.log(result);
  let tracks = result.body.items;
  res.render("tracks", { tracks });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
