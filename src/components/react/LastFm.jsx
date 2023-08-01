import React, { useState, useEffect } from "react";
import "../../styles/lastFm.css";

export const LastFm = () => {
  const [lfmData, updateLfmData] = useState({});

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
        <div>
          <p>Fetching from Last.FM servers...</p>
        </div>
      );
    }

    const [{ name: songName, artist: { "#text": artistName } = {} } = {}] =
      track;

    return (
      <div id="lastfmContainer">
        <p>
          Listening now to <b>{songName}</b> by <b>{artistName}</b>{" "}
          <img src="images/playingBars.gif" alt="Now playing" />
        </p>
      </div>
    );
  };
  return buildLastFmData();
};

export default LastFm;
