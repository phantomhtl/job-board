import React from 'react'

interface BadgeProps{
  children: React.ReactNode;
}
export default function Badge({children}:BadgeProps) {
  return (
    <span className='border rounded px-2 py-1 bg-muted text-muted-foreground text-sm font-medium'>
      {children}
    </span>
  )
}
