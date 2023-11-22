import React from "react";
import "./TrackList.css";
import Track from "../Track/Track";

function Tracklist(props) {
  return (
    <div className="TrackList">
      {/* <!-- You will add a map method that renders a set of Track components  --> */}
      {props.tracks.map((track) => {
        return (
          <Track
            key={track.id}
            track={track}
            onAdd={props.onAdd}
            onRemove={props.onRemove}
            isRemoval={props.isRemoval}
          />
        );
      })}
    </div>
  );
}

export default Tracklist;
