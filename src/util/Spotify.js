const clientID = process.env.REACT_APP_NOT_SECRET_CODE;
const redirectURI = "http://localhost:3000/"; //"https://myspotify-playlist.netlify.app";

let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if (urlAccessToken && urlExpiresIn) {
      accessToken = urlAccessToken[1];
      const expiresIn = Number(urlExpiresIn[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/"); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
      const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = redirect;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        //const jsonResponse = response.json();
        if (!jsonResponse.tracks) {
          console.log("No tracks found");
          return [];
        }
        return jsonResponse.tracks.items.map((tracks) => ({
          albumImage: tracks.album.images[0].url,
          id: tracks.id,
          name: tracks.name,
          artist: tracks.artists[0].name,
          album: tracks.album.name,
          uri: tracks.uri,
          previewUrl: tracks.preview_url,
        }));
      });
  },

  // savePlaylist(name, trackURIs) {
  //   return new Promise((resolve, reject) => {
  //     if (!name || !trackURIs.length) {
  //       reject("Invalid name or trackURIs");
  //       return;
  //     }

  //     let accessToken = Spotify.getAccessToken();
  //     const headers = { Authorization: `Bearer ${accessToken}` };
  //     let userID;

  //     fetch("https://api.spotify.com/v1/me", { headers: headers })
  //       .then((response) => {
  //         return response.json();
  //       })
  //       .then((jsonResonse) => {
  //         userID = jsonResonse.id;
  //         return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
  //           headers: headers,
  //           method: "POST",
  //           body: JSON.stringify({ name: name }),
  //         })
  //           .then((response) => {
  //             return response.json();
  //           })
  //           .then((jsonResponse) => {
  //             const playlistID = jsonResponse.id;
  //             return fetch(
  //               `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
  //               {
  //                 headers: headers,
  //                 method: "POST",
  //                 body: JSON.stringify({ uris: trackURIs }),
  //               }
  //             );
  //           })
  //           .then(() => {
  //             resolve("Playlist saved successfully");
  //           })
  //           .catch((error) => {
  //             reject(`Error saving playlist: ${error}`);
  //           });
  //       })
  //       .catch((error) => {
  //         reject(`Error fetching user data: ${error}`);
  //       });
  //   });
  // },

  ///     11111111

  // savePlaylist(name, trackURIs) {
  //   if (!name || !trackURIs.length) {
  //     return Promise.reject("Invalid name or trackURIs");
  //   }

  //   let accessToken = Spotify.getAccessToken();
  //   const headers = { Authorization: `Bearer ${accessToken}` };
  //   let userID;

  //   return fetch("https://api.spotify.com/v1/me", { headers: headers })
  //     .then((response) => response.json())
  //     .then((jsonResponse) => {
  //       userID = jsonResponse.id;
  //       return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
  //         headers: headers,
  //         method: "POST",
  //         body: JSON.stringify({ name: name }),
  //       });
  //     })
  //     .then((response) => response.json())
  //     .then((jsonResponse) => {
  //       const playlistID = jsonResponse.id;
  //       return fetch(
  //         `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
  //         {
  //           headers: headers,
  //           method: "POST",
  //           body: JSON.stringify({ uris: trackURIs }),
  //         }
  //       );
  //     })
  //     .then(() => {
  //       // Successful save
  //       return "Playlist saved successfully";
  //     })
  //     .catch((error) => {
  //       // Handle errors
  //       throw new Error(`Error saving playlist: ${error}`);
  //     });
  // },

  savePlaylist(name, trackURIs) {
    if (!name || !trackURIs.length) {
      return Promise.reject("Invalid name or trackURIs");
    }

    let accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userID;

    return fetch("https://api.spotify.com/v1/me", { headers: headers })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        });
      })
      .then((response) => response.json())
      .then((jsonResponse) => {
        const playlistID = jsonResponse.id;
        return fetch(
          `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
          {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ uris: trackURIs }),
          }
        );
      })
      .then(() => {
        // Successful save
        return "Playlist saved successfully";
      })
      .catch((error) => {
        // Handle errors
        throw new Error(`Error saving playlist: ${error}`);
      });
  },
};

export default Spotify;
