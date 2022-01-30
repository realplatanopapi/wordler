import { Text } from "theme-ui"

interface Props {
  children: React.ReactNode
  label?: string
  onClick: () => any
}

const TextButton: React.FC<Props> = ({
  children,
  label,
  onClick
}) => {
  return <Text role="button" tabIndex={0} aria-label={label} sx={{
    color: 'primary',
    cursor: 'pointer',
    textDecoration: 'underline'
  }} onClick={onClick} onKeyPress={event => {
    if (event.key == "Enter" || event.key == " ") {
      onClick()
    }
  }}>
    {children}
  </Text>
}

export default TextButton