import cc from 'classcat'
import { useEffect, useState, type FC, type PropsWithChildren } from 'react'
import { ReactFlowState, useReactFlow, useStore } from 'react-flow-renderer'
import { ControlProps } from './types'
import ControlButton from './ControlButton'

const selector = (s: ReactFlowState) => ({
  isInteractive: s.nodesDraggable || s.nodesConnectable || s.elementsSelectable,
  minZoomReached: s.transform[2] <= s.minZoom,
  maxZoomReached: s.transform[2] >= s.maxZoom,
})

const Controls: FC<PropsWithChildren<ControlProps>> = ({
  style,
  showZoom = true,
  showFitView = true,
  fitViewOptions,
  onZoomIn,
  onZoomOut,
  onFitView,
  className,
  onResetView, // Add this prop
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const { minZoomReached, maxZoomReached } = useStore(selector)
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!isVisible) {
    return null
  }

  const onZoomInHandler = () => {
    zoomIn()
    onZoomIn?.()
  }

  const onZoomOutHandler = () => {
    zoomOut()
    onZoomOut?.()
  }

  const onFitViewHandler = () => {
    fitView(fitViewOptions)
    onFitView?.()
  }

  return (
    <div
      className={cc(['react-flow__controls', className])}
      style={style}
      data-testid='rf__controls'
    >
      {showZoom && (
        <>
          <ControlButton
            onClick={onZoomInHandler}
            className='react-flow__controls-zoomin'
            title='zoom in'
            aria-label='zoom in'
            disabled={maxZoomReached}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 22 22'
              fill='none'
            >
              <path
                d='M21 21L16.65 16.65M11 8V14M8 11H14M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z'
                stroke='white'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          </ControlButton>
          <ControlButton
            onClick={onZoomOutHandler}
            className='react-flow__controls-zoomout'
            title='zoom out'
            aria-label='zoom out'
            disabled={minZoomReached}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 22 22'
              fill='none'
            >
              <path
                d='M21 21L16.65 16.65M8 11H14M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z'
                stroke='white'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          </ControlButton>
        </>
      )}
      {showFitView && (
        <ControlButton
          className='react-flow__controls-fitview'
          onClick={onFitViewHandler}
          title='fit view'
          aria-label='fit view'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 22 22'
            fill='none'
          >
            <path
              d='M8 3H6.2C5.0799 3 4.51984 3 4.09202 3.21799C3.71569 3.40973 3.40973 3.71569 3.21799 4.09202C3 4.51984 3 5.0799 3 6.2V8M8 21H6.2C5.0799 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V16M21 8V6.2C21 5.0799 21 4.51984 20.782 4.09202C20.5903 3.71569 20.2843 3.40973 19.908 3.21799C19.4802 3 18.9201 3 17.8 3H16M21 16V17.8C21 18.9201 21 19.4802 20.782 19.908C20.5903 20.2843 20.2843 20.5903 19.908 20.782C19.4802 21 18.9201 21 17.8 21H16M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z'
              stroke='white'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
        </ControlButton>
      )}
      <ControlButton
        className='react-flow__controls-resetview'
        onClick={onResetView}
        title='reset view'
        aria-label='reset view'
      >
        <svg width='20px' height='20px' viewBox='0 0 22 22' xmlns='http://www.w3.org/2000/svg'>
          <g
            fill='none'
            fill-rule='evenodd'
            stroke='#fff'
            stroke-linecap='round'
            stroke-linejoin='round'
            transform='matrix(0 1 1 0 2.5 2.5)'
          >
            <path d='m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8' />
            <path d='m4 1v4h-4' transform='matrix(1 0 0 -1 0 6)' />
          </g>
        </svg>
      </ControlButton>
    </div>
  )
}

export default Controls
