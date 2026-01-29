const BodyText = ({ text, children }: { text?: string; children?: string }) => {
  if (text || children) {
    return <span className="body_text">{text || children}</span>
  }
  return <></>
}

export { BodyText }
