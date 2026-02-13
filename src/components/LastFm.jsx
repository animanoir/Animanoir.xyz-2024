import React, { useState, useRef, useCallback, memo } from "react";
import * as lastFmStyles from "@/styles/lastFm.css";
import useLastFmData from "@/components/hooks/useLastFmData.js";

const LastFm = memo(({ customStyle, showAlbumCover = true }) => {
  const lfmData = useLastFmData();
  const albumCoverRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = useCallback((albumImage) => {
    if (albumImage) {
      setIsHovering(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
    // Update DOM directly via ref — no re-render needed
    if (albumCoverRef.current) {
      albumCoverRef.current.style.left = `${e.clientX}px`;
    }
  }, []);

  const { error, trackUrl } = lfmData;
  const track = lfmData?.recenttracks?.track;

  if (error) {
    return (
      <div style={customStyle} className="lastfmContainer fadeInQuick">
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
    <div style={customStyle} className="lastfmContainer fadeInQuick">
      <span
        onMouseEnter={() => handleMouseEnter(albumImage)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        Currently listening to{" "}
        <a className="lastFmLink" href={trackUrl} target="_blank">
          <b className="songInfo">{artistName}</b> <span style={{ color: "#FFFFFF39" }}>—</span>{" "}
          <b className="songInfo">{songName}</b>{" "}
        </a>
        <img src="/images/playingBars.gif" alt="Now playing" />
      </span>
      {showAlbumCover && (
        <div
          ref={albumCoverRef}
          className="albumCover"
          style={{
            zIndex: isHovering ? 1 : -1,
            left: 0,
            top: 40,
            opacity: isHovering ? 1 : 0,
          }}
        >
          <img src={albumImage} alt={albumName} />
        </div>
      )}
    </div>
  );
});

LastFm.displayName = "LastFm";

export { LastFm };
export default LastFm;
