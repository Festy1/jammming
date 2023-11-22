import React, { useCallback } from "react";
import "./Playlist.css";
import TrackList from "../TrackList/TrackList";

function Playlist(props) {
  const handleNameChange = useCallback(
    (e) => {
      props.onNameChange(e.target.value);
    },
    [props.onNameChange]
  );

  const handleSave = async () => {
    props.onSave(); //Trigger the onSave operation
    // You can add more logic here if needed
  };
  return (
    <div className="Playlist">
      <input defaultValue={"New Playlist"} onChange={handleNameChange} />
      {/* <!-- Add a TrackList component --> */}
      <TrackList
        tracks={props.playlistTracks}
        onRemove={props.onRemove}
        isRemoval={true}
      />
      <button
        className="Playlist-save"
        onClick={handleSave}
        disabled={props.isLoading}
      >
        {props.isLoading ? "SAVING..." : "SAVE TO SPOTIFY"}
      </button>
    </div>
  );
}

export default Playlist;
