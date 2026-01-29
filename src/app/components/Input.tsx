import React, { Ref } from 'react'
import { BodyText } from './Text'

const Input = React.forwardRef(
  (
    {
      placeholder,
      label,
      defaultValue,
      className,
      onBlur,
      onFocus,
      htmlType,
      error
    }: {
      placeholder?: string
      label?: string
      defaultValue?: string,
      className?: string,
      onBlur?: (e: any) => void,
      onFocus?: (e: any) => void,
      htmlType?: string
      error?: string | null
    },
    ref?: Ref<HTMLInputElement>,
  ) => {
    return (
      <div className={("input-wrapper")+(className ? ` ${className}` : '')}>
        {label && (
          <div className="input-title">
            <BodyText>{label}</BodyText>
          </div>
        )}
        <div className={("input-control")+(error ? " -with-error" : "")}>
          <input
            ref={ref}
            type={htmlType}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder || ''}
            defaultValue={defaultValue || ''}
          />
        </div>
        {error && <div className='input-error'><svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.99984 1.16602C3.77984 1.16602 1.1665 3.77935 1.1665 6.99935C1.1665 10.2193 3.77984 12.8327 6.99984 12.8327C10.2198 12.8327 12.8332 10.2193 12.8332 6.99935C12.8332 3.77935 10.2198 1.16602 6.99984 1.16602ZM6.99984 7.58268C6.679 7.58268 6.4165 7.32018 6.4165 6.99935V4.66602C6.4165 4.34518 6.679 4.08268 6.99984 4.08268C7.32067 4.08268 7.58317 4.34518 7.58317 4.66602V6.99935C7.58317 7.32018 7.32067 7.58268 6.99984 7.58268ZM7.58317 9.91602H6.4165V8.74935H7.58317V9.91602Z"
      fill="#B74B4B"
    />
  </svg><span>{error}</span></div>}
      </div>
    )
  },
)

export default Input
