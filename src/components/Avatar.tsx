import { useState } from 'react'
import { profile } from '../data/profile'
import './Avatar.css'

/** Foto de public/foto.jpg; si no existe, monograma JD. */
export function Avatar({ alt, size = 72 }: { alt: string; size?: number }) {
  const [failed, setFailed] = useState(false)

  return (
    <span className="avatar" style={{ width: size, height: size }}>
      {failed || !profile.photo ? (
        <span className="avatar__mono" aria-hidden="true" style={{ fontSize: size * 0.38 }}>
          JD
        </span>
      ) : (
        <img src={profile.photo} alt={alt} width={size} height={size} fetchPriority="high" onError={() => setFailed(true)} />
      )}
    </span>
  )
}
