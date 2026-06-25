import type { StaticImageData } from 'next/image'

type PosterImageProps = {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

/** Plain img avoids Next image optimizer failures with large poster JPEGs on Vercel. */
export function PosterImage({ src, alt, className = '', priority }: PosterImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

export function posterSrc(path: string | StaticImageData): string {
  return typeof path === 'string' ? path : path.src
}
