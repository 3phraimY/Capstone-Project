'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type Props = {
  src: string
  alt: string
  className?: string
}

const fallbackSrc =
  'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'

export default function ClientPosterImage({ src, alt, className }: Props) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    if (src === fallbackSrc) {
      setImgError(true)
    }
  }, [src])

  return (
    <div className={`relative ${className}`}>
      <img
        src={imgError ? fallbackSrc : src}
        alt={alt}
        referrerPolicy='no-referrer'
        className='h-full w-full object-cover'
        onError={() => setImgError(true)}
      />
      {imgError && (
        <span className='absolute inset-0 flex items-center justify-center text-center text-sm font-bold text-black'>
          {alt}
        </span>
      )}
    </div>
  )
}
