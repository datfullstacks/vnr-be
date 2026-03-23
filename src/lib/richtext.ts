type LexicalNode = {
  children?: LexicalNode[]
  text?: string
  type?: string
}

export function lexicalFromPlainText(value: string) {
  return {
    root: {
      children: value
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((paragraph) => ({
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: paragraph.trim(),
              type: 'text',
              version: 1,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        })),
      direction: null,
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

export function toPlainText(value: unknown): string {
  if (!value) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value !== 'object') {
    return ''
  }

  const root = (value as { root?: LexicalNode }).root

  if (!root?.children) {
    return ''
  }

  const paragraphs = root.children
    .map((child) => {
      if (!child.children) {
        return child.text ?? ''
      }

      return child.children.map((nested) => nested.text ?? '').join('')
    })
    .filter(Boolean)

  return paragraphs.join('\n\n')
}
