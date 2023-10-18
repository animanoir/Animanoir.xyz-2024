import { useState, useEffect } from "react";

const useLastFmData = (username = "swoephowx") => {
  const [lfmData, updateLfmData] = useState({});

  useEffect(() => {
    fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${username}&api_key=8d1394415d95c0771ac9f8247cc7ee17&limit=1&nowplaying=true&format=json`
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
          error: "Last.fm servers are unavailable at this moment...",
        })
      );
  }, [username]);

  return lfmData;
};

export default useLastFmData;
