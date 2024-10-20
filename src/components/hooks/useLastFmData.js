import { useState, useEffect } from "react";

const useLastFmData = (username = "swoephowx") => {
  const [lfmData, updateLfmData] = useState({});

  useEffect(() => {
    fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${username}&api_key=${import.meta.env.PUBLIC_LASTFM_API}&limit=1&nowplaying=true&format=json`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("error");
      })
      .then((data) => {
        const track = data?.recenttracks?.track?.[0];
        const trackUrl = track?.url;
        updateLfmData({ ...data, trackUrl });
      })
      .catch(() =>
        updateLfmData({
          error: "Last.fm servers are unavailable at this moment...",
        })
      );
  }, [username]);
  return lfmData;
};

export default useLastFmData;
