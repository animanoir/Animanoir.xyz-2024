import React, { useEffect, useState } from "react";
import styles from "./RandomVideo.module.css";

export default function Video({ videoPath }) {
  const [isLoading, setIsLoading] = useState(true);
  const [videoSrc, setVideoSrc] = useState(videoPath)
  
  const handleLoadedData = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    setVideoSrc(videoPath)
  },[])

  return (
    <div className={styles.video}>
      {isLoading && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      )}
      <video
        key={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={handleLoadedData}
        className={`${styles.video} ${isLoading ? styles.hidden : styles.visible}`}
      >
        <source src={videoPath} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}