"use client"
import type { Editor } from "@tiptap/react"
import {
  Bold,
  Code,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Strikethrough,
  Quote,
  Undo,
  Redo,
  Link
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

type Props = {
  editor: Editor | null
}

export function Toolbar({ editor }: Props) {
  if (!editor) {
    return null
  }

  return (
    <div className="border border-input bg-transparent rounded-md p-2 flex gap-2">

      {/* Жирный текст */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      {/* Курсив */}
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      {/* Подчёркнутый текст */}
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>

      {/* Зачёркнутый текст */}
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      {/* Код */}
      <Toggle
        size="sm"
        pressed={editor.isActive("code")}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Toggle>

      {/* Цитата */}
      <Toggle
        size="sm"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
      <Quote className="h-4 w-4" />
      </Toggle>

      {/* Маркированный список */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>

      {/* Нумерованный список */}
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      {/* Вставка ссылки */}
      <Toggle
        size="sm"
        pressed={editor.isActive('link')}
        onPressedChange={() => {
          const url = prompt('Введите URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          } else {
            editor.chain().focus().unsetLink().run();
          }
        }}
      >
        <Link className="h-4 w-4" />
      </Toggle>

      {/* Отменить действие */}
      <Toggle size="sm" onPressedChange={() => editor.chain().focus().undo().run()}>
        <Undo className="h-4 w-4" />
      </Toggle>

      {/* Повторить действие */}
      <Toggle size="sm" onPressedChange={() => editor.chain().focus().redo().run()}>
        <Redo className="h-4 w-4" />
      </Toggle>
    </div>
  )
}

