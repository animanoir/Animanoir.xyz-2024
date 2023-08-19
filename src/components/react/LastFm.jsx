import React, { useState, useEffect } from "react";
import "../../styles/lastFm.css";
import useLastFmData from "../hooks/useLastFmData";

export const LastFm = () => {
  const lfmData = useLastFmData();
  const [albumImageState, setAlbumImageState] = useState({
    x: 0,
    y: 0,
  });
  const [onMouseEnter, setOnMouseEnter] = useState(false);

  useEffect(() => {
    fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=swoephowx&api_key=8d1394415d95c0771ac9f8247cc7ee17&limit=1&nowplaying=true&format=json`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("error");
      })
      .then((data) => updateLfmData(data))
      .catch(() =>
        updateLfmData({
          error: "Last.fm servers are unavailable at this moment.",
        })
      );
  }, []);

  const handleMouseEnter = (albumImage) => {
    if (albumImage) {
      setOnMouseEnter(true);
    }
  };

  const handleMouseLeave = () => {
    setOnMouseEnter(false);
  };

  const handleMouseMove = (e) => {
    setAlbumImageState({ ...albumImageState, x: e.clientX, y: e.clientY });
  };

  const buildLastFmData = () => {
    const { error } = lfmData;
    const track = lfmData?.recenttracks?.track;

    if (error) {
      return (
        <div className={lastFmStyles.container}>
          <p>{error}</p>
        </div>
      );
    }

    if (!track) {
      return (
        <div className="lastfmContainer">
          <p>Fetching from Last.FM servers...</p>
        </div>
      );
    }

    const [
      {
        name: songName,
        artist: { "#text": artistName },
        album: { "#text": albumName },
        image,
      } = {},
    ] = track;
    const albumImage = image?.[image.length - 1]?.["#text"];

    return (
      <div className="lastfmContainer fadeInQuick">
        <p
          onMouseEnter={() => handleMouseEnter(albumImage)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          Listening now to <b style={{ color: "grey" }}>{songName}</b> by{" "}
          <b style={{ color: "grey" }}>{artistName}</b>{" "}
          <img src="images/playingBars.gif" alt="Now playing" />
        </p>
        <div
          className="albumCover"
          style={{
            zIndex: onMouseEnter ? 1 : -1,
            left: albumImageState.x + 10,
            top: albumImageState.y + 10,
            opacity: onMouseEnter ? 1 : 0,
          }}
        >
          <img src={albumImage} alt={albumName} />
        </div>
      </div>
    );
  };
  return buildLastFmData();
};

export default LastFm;
