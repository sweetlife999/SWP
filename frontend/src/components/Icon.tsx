import React from 'react'

interface IconProps {
  id: string
  className?: string
  style?: React.CSSProperties
}

export function Icon({ id, className, style }: IconProps) {
  return (
    <svg className={`lucide${className ? ' ' + className : ''}`} style={style}>
      <use href={`/icons.svg#${id}`} />
    </svg>
  )
}
