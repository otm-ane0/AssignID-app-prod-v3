import Link from 'next/link'

const BodyLink = ({
  text,
  target,
  children,
}: {
  text?: string
  target?: string
  children?: string
}) => {
  if (text || children) {
    return (
      <Link href={target || '/'} className="body_link">
        {text || children}
      </Link>
    )
  }
  return <></>
}

export { BodyLink }
