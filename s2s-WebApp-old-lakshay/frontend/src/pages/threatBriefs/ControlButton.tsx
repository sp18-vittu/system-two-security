import React, { type FC, type PropsWithChildren } from 'react'
import cc from 'classcat'
import { ControlButtonProps } from './types'

const ControlButton: FC<PropsWithChildren<ControlButtonProps>> = ({ children, ...rest }) => (
  <button
    type='button'
    style={{
      background: '#0C111D',
      borderBottom: 'none',
      width: '42px',
      height: '42px',
      display: 'block',
      padding: '12px',
    }}
    className={cc(['react-flow__controls-button'])}
    {...rest}
  >
    {children}
  </button>
)

ControlButton.displayName = 'ControlButton'

export default ControlButton
