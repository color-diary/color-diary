import React from 'react'

export const Loading = () => {
  return (
    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid"
                    width="100"
                    height="100"
                    style={{
                      shapeRendering: 'auto',
                      display: 'block',
                      background: 'transparent',
                    }}
                  >
                    <g>
                      <g>
                        <path
                          strokeWidth="3"
                          stroke="#33d4aa"
                          fill="none"
                          d="M50 3A47 47 0 1 0 83.23401871576775 16.765981284232275"
                        ></path>
                        <path fill="#33d4aa" d="M49 -4L49 10L56 3L49 -4"></path>
                        <animateTransform
                          keyTimes="0;1"
                          values="0 50 50;360 50 50"
                          dur="2.6315789473684212s"
                          repeatCount="indefinite"
                          type="rotate"
                          attributeName="transform"
                        ></animateTransform>
                      </g>
                    </g>
                  </svg>
  )
}
