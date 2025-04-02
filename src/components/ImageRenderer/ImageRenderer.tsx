import React, { useEffect, useState } from 'react'

interface ImageRendererProps {
  imageDataBase64: string
}
const ImageRenderer = ({ imageDataBase64 }: ImageRendererProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    if (imageDataBase64) {
      setImageSrc(`data:image/png;base64,${imageDataBase64}`)
    }
  }, [imageDataBase64])

  if (!imageSrc) {
    return <div>Loading image...</div> // Or a placeholder
  }

  return <img src={imageSrc} alt="Rendered from Gemini" />
}

export default ImageRenderer