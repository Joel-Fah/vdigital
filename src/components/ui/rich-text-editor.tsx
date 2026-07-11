'use client';

import { useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Strikethrough, List, ListOrdered, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * RichTextEditor — lightweight Tiptap WYSIWYG for long fields. Text formatting
 * only (bold / italic / strike / lists / links), no layout. Emits HTML into a
 * hidden input so it submits inside a plain <form>; the server action sanitizes
 * it on write (src/lib/html.ts).
 */
export function RichTextEditor({
  name,
  defaultValue = '',
}: {
  name: string;
  defaultValue?: string;
}) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    // Required in Next.js to avoid an SSR hydration mismatch.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class:
          'prose-vd min-h-[140px] w-full px-3.5 py-2.5 focus:outline-none [&_.is-editor-empty:first-child]:before:text-ink-light',
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.isEmpty ? '' : editor.getHTML()),
  });

  return (
    <div className="rounded border border-line bg-surface-white transition-colors focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20">
      <input type="hidden" name={name} value={html} />
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const btn = (active: boolean) =>
    cn(
      'flex h-7 w-7 items-center justify-center rounded text-ink-mid transition-colors hover:bg-teal-ultra hover:text-teal',
      active && 'bg-teal-ultra text-teal',
    );

  function setLink() {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL du lien', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-line px-2 py-1.5">
      <button
        type="button"
        aria-label="Gras"
        className={btn(editor.isActive('bold'))}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-label="Italique"
        className={btn(editor.isActive('italic'))}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-label="Barré"
        className={btn(editor.isActive('strike'))}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </button>
      <span className="mx-1 h-4 w-px bg-line" />
      <button
        type="button"
        aria-label="Liste à puces"
        className={btn(editor.isActive('bulletList'))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-label="Liste numérotée"
        className={btn(editor.isActive('orderedList'))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </button>
      <span className="mx-1 h-4 w-px bg-line" />
      <button
        type="button"
        aria-label="Lien"
        className={btn(editor.isActive('link'))}
        onClick={setLink}
      >
        <LinkIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
