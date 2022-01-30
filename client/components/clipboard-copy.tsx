import { copyToClipboard } from '@client/utils'
import React, { useState } from 'react'
import TextButton from './text-button'

interface Props {
  textToCopy: string
  label?: string
}

const ClipboardCopy: React.FC<Props> = ({textToCopy, label = 'Click to copy'}) => {
  const [isCopied, setIsCopied] = useState(false)

  return (
    <TextButton onClick={async () => {
      await copyToClipboard(textToCopy)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }}>
      {
        isCopied ? 'Copied!' : label
      }
    </TextButton>
  )
}

export default ClipboardCopy