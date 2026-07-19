import { useEffect, useRef } from 'react'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'

interface CardDescriptionEditorProps {
  initialHtml: string
  onChangeHtml: (html: string) => void
}

// Card descriptions stay plain HTML on the backend (kanban_cards.description),
// same as the app's other rich-text fields — BlockNote is only the editing UI.
// HTML <-> blocks conversion happens at this boundary so no schema change is
// needed for the "/" slash-command block editor (headings, todo lists, etc.).
export function CardDescriptionEditor({ initialHtml, onChangeHtml }: CardDescriptionEditorProps) {
  const editor = useCreateBlockNote()
  const loadedInitialHtml = useRef(false)

  useEffect(() => {
    if (loadedInitialHtml.current) return
    loadedInitialHtml.current = true
    if (initialHtml) {
      const blocks = editor.tryParseHTMLToBlocks(initialHtml)
      editor.replaceBlocks(editor.document, blocks)
    }
  }, [editor, initialHtml])

  return (
    <BlockNoteView
      editor={editor}
      theme="light"
      onChange={() => onChangeHtml(editor.blocksToHTMLLossy(editor.document))}
    />
  )
}
