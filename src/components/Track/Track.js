import React, { useCallback, useState } from "react";
import "./Track.css";

function Track(props) {
  const [isPlaying, setIsPlaying] = useState(false); //this handles the preview mp3 controls

  // //for adding track
  // const addTrack = useCallback(
  //   (event) => {
  //     props.onAdd(props.track);
  //   },
  //   [props.onAdd, props.track]
  // );
  const addTrack = useCallback(() => {
    const { onAdd, track } = props;
    onAdd(track);
  }, [props]);

  // //for removing track
  // const removeTrack = useCallback(
  //   (event) => {
  //     props.onRemove(props.track);
  //   },
  //   [props.onRemove, props.track]
  // );

  const removeTrack = useCallback(() => {
    const { onRemove, track } = props;
    onRemove(track);
  }, [props]);

  //this is for playing preview
  const playPreview = () => {
    setIsPlaying(true);
  };

  //this is for stopping mp3  preview
  const stopPreview = () => {
    setIsPlaying(false);
  };

  const renderAction = () => {
    if (props.isRemoval) {
      return (
        <button className="Track-action" onClick={removeTrack}>
          -
        </button>
      );
    } else {
      return (
        <>
          <button className="Track-action" onClick={addTrack}>
            +
          </button>
          {props.track.previewUrl && (
            <button
              className="Track-action2"
              onClick={isPlaying ? stopPreview : playPreview}
            >
              {isPlaying ? "Stop" : "Preview"}
            </button>
          )}
        </>
      );
    }
  };

  return (
    <div className="Track">
      {props.track.albumImage && (
        <img
          src={props.track.albumImage}
          alt={props.track.album}
          className="Album-image"
        />
      )}
      <div className="Track-information">
        <h3>{props.track.name}</h3>
        <p>
          {props.track.artist} | {props.track.album}
        </p>
      </div>
      {renderAction()}
      {/* adding the audio part of track to play preview */}
      {props.track.previewUrl && isPlaying && (
        <audio controls>
          <source src={props.track.previewUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

export default Track;
