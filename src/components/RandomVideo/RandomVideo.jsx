import React, { useState, useEffect } from "react";
import vid1 from "@/images/works/visuals/vid1.webm";
import vid2 from "@/images/works/visuals/vid2.webm";
import vid3 from "@/images/works/visuals/vid3.webm";
import vid4 from "@/images/works/visuals/vid4.webm";
import vid5 from "@/images/works/visuals/vid5.webm";
import vid6 from "@/images/works/visuals/vid6.webm";
import vid8 from "@/images/works/visuals/vid8.webm";
import styles from "./RandomVideo.module.css";

export default function RandomVideo() {
  const [isLoading, setIsLoading] = useState(true);
  const videos = [vid1, vid2, vid3, vid4, vid5, vid6, vid8];
  const [videoSrc, setVideoSrc] = useState(videos[0]); // Start with a default video

  useEffect(() => {
    // Select random video only on client-side
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setVideoSrc(randomVideo);
  }, []);

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  return (
    <div className={styles.videoContainer}>
      {isLoading && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      )}
      <video
        key={videoSrc} // Add key to force re-render when source changes
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={handleLoadedData}
        className={`${styles.video} ${isLoading ? styles.hidden : styles.visible}`}
      >
        <source src={videoSrc} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}