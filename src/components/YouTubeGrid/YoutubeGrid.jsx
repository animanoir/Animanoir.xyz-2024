import React, { useState, useEffect } from 'react';
import './YoutubeGrid.css';

const PLAYLIST_ID = 'PLNgUiXAsdpaVbq6BO8H0ZVS20h0A_o_2F';
const API_KEY = import.meta.env.PUBLIC_YOUTUBE_API;

export function YouTubeGrid({ count = 1 }) {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        // Fetch playlist items
        const playlistResponse = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${API_KEY}`);
        if (!playlistResponse.ok) {
          throw new Error(`HTTP error! status: ${playlistResponse.status}`);
        }
        const playlistData = await playlistResponse.json();
        if (!playlistData.items) {
          throw new Error('No items in playlist response');
        }

        // Extract video IDs
        const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId).join(',');

        // Fetch video details
        const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds}&key=${API_KEY}`);
        if (!videoResponse.ok) {
          throw new Error(`HTTP error! status: ${videoResponse.status}`);
        }
        const videoData = await videoResponse.json();
        if (!videoData.items) {
          throw new Error('No items in video response');
        }

        // Shuffle and slice videos
        const shuffled = videoData.items.sort(() => 0.5 - Math.random());
        setVideos(shuffled.slice(0, count));
      } catch (err) {
        console.error('Failed to fetch videos:', err);
        setError(err.message);
      }
    }

    fetchVideos();
  }, [count]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="youtube-grid">
      {videos.map((video) => {
      
      const randomDelay = Math.random() * 5; // up to 5s delay
      
      return (
        <div key={video.id} className="youtube-grid-item">
          <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank">
            <img 
              className="youtube-grid-item-img random-fade" 
              style={{ '--random-delay': randomDelay }}
              src={video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url} 
              alt={video.snippet.title}
            />
          </a>
        </div>
      )})}
    </div>
  );
}