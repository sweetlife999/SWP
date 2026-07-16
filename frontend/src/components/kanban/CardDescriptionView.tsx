import { useEffect, useRef } from 'react'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'

interface CardDescriptionViewProps {
  html: string
}

// Read-only counterpart to CardDescriptionEditor: mounts the same BlockNoteView
// with editable={false} so checklists, nesting, and code blocks render with
// their real styling outside edit mode too (issue #125 Bug 2) — a raw
// dangerouslySetInnerHTML div has no BlockNote CSS to hook into.
export function CardDescriptionView({ html }: CardDescriptionViewProps) {
  const editor = useCreateBlockNote()
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    const blocks = editor.tryParseHTMLToBlocks(html)
    editor.replaceBlocks(editor.document, blocks)
  }, [editor, html])

  return <BlockNoteView editor={editor} editable={false} theme="light" />
}
