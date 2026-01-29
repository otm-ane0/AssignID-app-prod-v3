import * as React from 'react'
import { SVGProps } from 'react'
const BackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={17}
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask
      id="mask0_4388_533"
      style={{
        maskType: 'alpha',
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={16}
      height={17}
    >
      <rect width={16} height={17} fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_4388_533)">
      <path
        d="M7.99984 14.1673L2.6665 8.50065L7.99984 2.83398L8.94984 3.82565L5.2165 7.79232H13.3332V9.20898H5.2165L8.94984 13.1757L7.99984 14.1673Z"
        fill="#428CE3"
      />
    </g>
  </svg>
)
export default BackIcon
