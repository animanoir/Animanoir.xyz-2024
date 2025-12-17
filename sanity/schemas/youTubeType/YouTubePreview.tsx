import type { PreviewProps } from 'sanity'
import { Flex, Text } from '@sanity/ui'

// Helper function to extract YouTube video ID from URL
function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export function YouTubePreview(props: PreviewProps) {
  const { title: url } = props

  if (typeof url !== 'string') {
    return (
      <Flex padding={3} align="center" justify="center">
        <Text>Add a YouTube URL</Text>
      </Flex>
    )
  }

  const videoId = getYouTubeId(url)

  if (!videoId) {
    return (
      <Flex padding={3} align="center" justify="center">
        <Text>Invalid YouTube URL</Text>
      </Flex>
    )
  }

  return (
    <Flex padding={3} align="center" justify="center">
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video preview"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ maxWidth: '100%' }}
      />
    </Flex>
  )
}