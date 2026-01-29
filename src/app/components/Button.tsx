import React, { Ref } from 'react'
import { BodyText } from './Text'

export enum ButtonType {
  Primary = 'primary',
  Secondary = 'secondary',
  SecondaryWithBorder = 'secondary ss',
  NoBorder = 'noborder',
  TextButton = 'txt',
}

const Button = React.forwardRef(
  (
    {
      icon,
      label,
      type,
      className,
      onClick,
      htmlType,
      children,
      disabled,
    }: {
      icon?: any
      label?: string
      type?: ButtonType
      className?: string
      htmlType?: 'button' | 'submit' | 'reset'
      onClick?: (e: any) => void
      children?: any
      disabled?: boolean
    },
    ref?: Ref<HTMLDivElement>,
  ) => {
    return (
      <button
        disabled={disabled}
        type={htmlType || 'button'}
        className={'button-wrapper' + (className ? ` ${className}` : '')}
        onClick={onClick}
      >
        <div
          ref={ref}
          className={'button-control' + (type ? ` btnt-${type}` : '')}
        >
          <div className="button">
            {icon && (
              <span className={'icon-wrapper' + (label ? '' : ' mMinus')}>
                {icon}
              </span>
            )}
            <BodyText>{label || children}</BodyText>
          </div>
        </div>
      </button>
    )
  },
)

export default Button
