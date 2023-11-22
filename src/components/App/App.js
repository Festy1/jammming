import React, { useCallback, useState, useEffect } from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

function App() {
  const [searchResults, setSearchResults] = useState([
    // {
    //   name: "Example Track Name",
    //   artist: "Example Track Artist",
    //   album: "Example Track Album",
    //   id: 1,
    // },
    // {
    //   name: "Example Track Name 2",
    //   artist: "Example Track Artist 2",
    //   album: "Example Track Album 2",
    //   id: 2,
    // },
  ]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([
    // {
    //   name: "Example PlaylistTrack Name",
    //   artist: "Example Playlist Track Artist",
    //   album: "Example Playlist Track Album",
    //   id: 3,
    // },
    // {
    //   name: "Example PlaylistTrack Name",
    //   artist: "Example Playlist Track Artist 4",
    //   album: "Example Playlist Track Album 4",
    //   id: 4,
    // },
  ]);
  const [alertMessage, setAlertMessage] = useState(""); //This is for the alert message
  const [isLoading, setIsLoading] = useState(false); //This is for the loading effect after the saveToSpotify button is clicked

  //The useEffect is for the alert that will pop up on the screen,
  // and its been used by multiple functions.
  useEffect(() => {
    let timeout;

    if (alertMessage) {
      timeout = setTimeout(() => {
        setAlertMessage("");
      }, 800);
    }
    return () => clearTimeout(timeout);
  }, [alertMessage]);

  //the search method is the last method added to this function component
  const search = useCallback((term) => {
    Spotify.search(term).then(setSearchResults);
  }, []);

  //This is for adding Tracks
  const addTrack = useCallback(
    (track) => {
      if (playlistTracks.some((playlistTrack) => playlistTrack.id === track.id))
        return setAlertMessage("Track already added");
      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
    },
    [playlistTracks]
  );

  //This is for removing Tracks.
  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((playlistTrack) => playlistTrack.id !== track.id)
    );
  }, []);

  //This part update the playlist name
  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
  }, []);

  //This part updates the playlist to spotify
  const savePlaylist = useCallback(() => {
    setIsLoading(true); // Set loading state to true when saving starts

    const trackUris = playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackUris)
      .then((message) => {
        setPlaylistName("New Playlist");
        setPlaylistTracks([]);
        setAlertMessage(message);
      })
      .catch((error) => {
        // Handle the error here
        setAlertMessage(error.message); // or any other way you want to handle the error
      })
      .finally(() => {
        setIsLoading(false); // Set loading state to false when saving completes (success or error)
      });
  }, [playlistName, playlistTracks]);

  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        {/* <!-- Add a SearchBar component -->  */}
        <SearchBar onSearch={search} />

        <div className="App-playlist">
          {/* <!-- Add a SearchResults component --> */}
          <SearchResults searchResults={searchResults} onAdd={addTrack} />

          {/* <!-- Add a Playlist component --> */}
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist}
            isLoading={isLoading}
          />
          {alertMessage && <div className="alert">{alertMessage}</div>}
        </div>
      </div>
    </div>
  );
}
export default App;
