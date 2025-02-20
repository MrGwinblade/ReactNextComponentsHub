"use client"

import { cn } from "@/shared/lib/utils"
import React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { Toolbar } from "./toolbar"
import { Placeholder } from "@tiptap/extension-placeholder"
import {Blockquote} from "@tiptap/extension-blockquote"
import {BulletList} from "@tiptap/extension-bullet-list"
import {OrderedList} from "@tiptap/extension-ordered-list"
import {Link} from '@tiptap/extension-link'


interface Props {
  className?: string
}

export default function Tiptap({
  description,
  onChange,
}: {
  description: string
  onChange: (richText: string) => void
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Underline,
      Blockquote,
      BulletList,
      OrderedList,
      Placeholder.configure({
        placeholder: "Enter description...",
        showOnlyWhenEditable: true,
        emptyEditorClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }

            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            // disallowed domains
            const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
            const domain = parsedUrl.hostname

            if (disallowedDomains.includes(domain)) {
              return false
            }

            // all checks have passed
            return true
          } catch {
            return false
          }
        },
        shouldAutoLink: url => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
            const domain = parsedUrl.hostname

            return !disallowedDomains.includes(domain)
          } catch {
            return false
          }
        },

      }),
    ],
    content: description || "", // Если пусто, не передаём "undefined"
    editorProps: {
      attributes: {
        class: cn(
          "rounded-md border min-h-[150px] border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-left",
        ),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  React.useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = styles
    document.head.appendChild(styleElement)
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  return (
    <div className="flex flex-col justify-stretch min-h-[250px]">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  )
}

const styles = `
  .tiptap-editor .is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
  }
`

