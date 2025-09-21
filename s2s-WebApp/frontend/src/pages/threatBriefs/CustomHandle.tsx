import React from 'react'
import { Handle, HandleProps } from 'react-flow-renderer'

export default function CustomHandle(props: HandleProps) {
  return (
    <Handle
      style={{
        visibility: 'hidden',
      }}
      {...props}
    />
  )
}
