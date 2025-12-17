// Type declarations for react-player sub-modules
// react-player doesn't ship with types for its individual player imports
declare module 'react-player/youtube' {
  import { Component } from 'react';

  interface YouTubePlayerProps {
    url?: string;
    playing?: boolean;
    loop?: boolean;
    controls?: boolean;
    light?: boolean | string;
    volume?: number;
    muted?: boolean;
    playbackRate?: number;
    width?: string | number;
    height?: string | number;
    style?: object;
    progressInterval?: number;
    playsinline?: boolean;
    pip?: boolean;
    stopOnUnmount?: boolean;
    fallback?: React.ReactNode;
    wrapper?: string | React.ComponentType<{ children: React.ReactNode }>;
    config?: object;
    onReady?: (player: any) => void;
    onStart?: () => void;
    onPlay?: () => void;
    onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
    onDuration?: (duration: number) => void;
    onPause?: () => void;
    onBuffer?: () => void;
    onBufferEnd?: () => void;
    onSeek?: (seconds: number) => void;
    onEnded?: () => void;
    onError?: (error: any) => void;
    onClickPreview?: (event: any) => void;
    onEnablePIP?: () => void;
    onDisablePIP?: () => void;
  }

  export default class YouTubePlayer extends Component<YouTubePlayerProps> { }
}
