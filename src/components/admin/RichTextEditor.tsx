"use client";

import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { DropdownMenu } from "radix-ui";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { checkImageFile, uploadNewsImage } from "@/lib/news/storage";
import { whatsappTextToHtml } from "@/lib/news/whatsapp";
import { cn } from "@/lib/utils";

import { Icon, type IconName } from "./icons";
import { PromptDialog } from "./ui";

const YOUTUBE_URL = /^https?:\/\/(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{6,}/i;

function escapeAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function normalizeUrl(value: string) {
  if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
  return `https://${value}`;
}

type SlashItem = { id: string; label: string; hint: string; icon: IconName | "h2" | "h3" };

const SLASH_ITEMS: SlashItem[] = [
  { id: "h2", label: "Intertitre", hint: "Grand titre de section", icon: "h2" },
  { id: "h3", label: "Sous-intertitre", hint: "Titre de niveau 3", icon: "h3" },
  { id: "bullet", label: "Liste à puces", hint: "Liste simple", icon: "list" },
  { id: "ordered", label: "Liste numérotée", hint: "Étapes, classement", icon: "listOrdered" },
  { id: "quote", label: "Citation", hint: "Parole d'un membre ou d'un client", icon: "quote" },
  { id: "image", label: "Image", hint: "JPG, PNG ou WebP · 5 Mo max", icon: "image" },
  { id: "video", label: "Vidéo YouTube", hint: "Lien d'une vidéo YouTube", icon: "video" },
  { id: "rule", label: "Séparateur", hint: "Ligne horizontale", icon: "minus" },
];

const BLOCK_TYPES = [
  { id: "paragraph", label: "Paragraphe" },
  { id: "h2", label: "Intertitre" },
  { id: "h3", label: "Sous-intertitre" },
] as const;

function ToolbarButton({
  label,
  active = false,
  onClick,
  children,
  className,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex size-10 cursor-pointer items-center justify-center rounded-[7px] border-none bg-transparent text-bo-ink transition-colors hover:bg-bo-line-soft",
        active && "bg-bo-teal-soft text-bo-teal hover:bg-bo-teal-soft",
        className
      )}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <span aria-hidden="true" className="mx-1.5 h-[22px] w-px bg-bo-line" />;
}

export default function RichTextEditor({
  initialHtml,
  onChange,
  labelledBy,
}: {
  initialHtml: string;
  onChange: (html: string) => void;
  labelledBy: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const [linkOpen, setLinkOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [uploading, setUploading] = useState(0);

  // Menu « / » : position du caractère tapé et élément sélectionné.
  const [slash, setSlash] = useState<{ pos: number; top: number; left: number } | null>(null);
  const [slashIndex, setSlashIndex] = useState(0);
  const slashRef = useRef(slash);
  const slashIndexRef = useRef(slashIndex);
  const runSlashRef = useRef<(item: SlashItem) => void>(() => {});
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
    slashRef.current = slash;
    slashIndexRef.current = slashIndex;
  });

  const insertImages = useCallback(async (editor: Editor, files: File[], at?: number) => {
    const images = files.filter((file) => {
      const problem = checkImageFile(file);
      if (problem) toast.error(problem);
      return !problem;
    });
    for (const file of images) {
      setUploading((count) => count + 1);
      try {
        const src = await uploadNewsImage(file, "content");
        const chain = editor.chain().focus();
        (at !== undefined ? chain.insertContentAt(at, { type: "image", attrs: { src, alt: "" } }) : chain.setImage({ src, alt: "" })).run();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Envoi de l'image impossible.");
      } finally {
        setUploading((count) => count - 1);
      }
    }
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
        },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Youtube.configure({ nocookie: true, modestBranding: true, width: 640, height: 360 }),
      Placeholder.configure({ placeholder: "Tapez « / » pour insérer un bloc…", showOnlyCurrent: false }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class: "news-content",
        "aria-labelledby": labelledBy,
        "aria-multiline": "true",
        role: "textbox",
      },
      handleKeyDown(view, event) {
        const open = slashRef.current;
        if (open) {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            const delta = event.key === "ArrowDown" ? 1 : -1;
            setSlashIndex((index) => (index + delta + SLASH_ITEMS.length) % SLASH_ITEMS.length);
            return true;
          }
          if (event.key === "Enter" || event.key === "Tab") {
            runSlashRef.current(SLASH_ITEMS[slashIndexRef.current]);
            return true;
          }
          if (event.key === "Escape") {
            setSlash(null);
            return true;
          }
          setSlash(null);
          return false;
        }
        if (event.key === "/" && !event.ctrlKey && !event.metaKey) {
          const { $from, empty } = view.state.selection;
          if (empty && $from.parent.type.name === "paragraph" && $from.parent.content.size === 0) {
            // Laisse le « / » s'insérer, puis ouvre le menu sous le curseur.
            requestAnimationFrame(() => {
              const pos = view.state.selection.from;
              const coords = view.coordsAtPos(pos);
              const box = wrapperRef.current?.getBoundingClientRect();
              if (!box) return;
              setSlashIndex(0);
              // Menu de 280 px, gardé dans la largeur de l'éditeur.
              const left = Math.max(8, Math.min(coords.left - box.left, box.width - 290));
              setSlash({ pos, top: coords.bottom - box.top + 6, left });
            });
          }
        }
        return false;
      },
      handleDrop(view, event, _slice, moved) {
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (moved || !files.some((file) => file.type.startsWith("image/"))) return false;
        event.preventDefault();
        const at = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        if (editorRef.current) void insertImages(editorRef.current, files, at);
        return true;
      },
      handlePaste(_view, event) {
        const files = Array.from(event.clipboardData?.files ?? []);
        if (!files.some((file) => file.type.startsWith("image/"))) return false;
        if (editorRef.current) void insertImages(editorRef.current, files);
        return true;
      },
    },
    onUpdate({ editor: current }) {
      onChangeRef.current(current.isEmpty ? "" : current.getHTML());
    },
    onBlur() {
      setSlash(null);
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current?.isActive("bold") ?? false,
      italic: current?.isActive("italic") ?? false,
      h2: current?.isActive("heading", { level: 2 }) ?? false,
      h3: current?.isActive("heading", { level: 3 }) ?? false,
      bullet: current?.isActive("bulletList") ?? false,
      quote: current?.isActive("blockquote") ?? false,
      link: current?.isActive("link") ?? false,
    }),
  });

  const runSlash = useCallback(
    (item: SlashItem) => {
      const open = slashRef.current;
      if (!editor || !open) return;
      setSlash(null);
      const chain = editor.chain().focus().deleteRange({ from: open.pos - 1, to: open.pos });
      switch (item.id) {
        case "h2":
          chain.setHeading({ level: 2 }).run();
          break;
        case "h3":
          chain.setHeading({ level: 3 }).run();
          break;
        case "bullet":
          chain.toggleBulletList().run();
          break;
        case "ordered":
          chain.toggleOrderedList().run();
          break;
        case "quote":
          chain.toggleBlockquote().run();
          break;
        case "rule":
          chain.setHorizontalRule().run();
          break;
        case "image":
          chain.run();
          fileInputRef.current?.click();
          break;
        case "video":
          chain.run();
          setVideoOpen(true);
          break;
      }
    },
    [editor]
  );

  useEffect(() => {
    runSlashRef.current = runSlash;
  }, [runSlash]);

  const blockType = state?.h2 ? "h2" : state?.h3 ? "h3" : "paragraph";
  const blockLabel = BLOCK_TYPES.find((type) => type.id === blockType)?.label ?? "Paragraphe";

  const setBlockType = (id: (typeof BLOCK_TYPES)[number]["id"]) => {
    if (!editor) return;
    const chain = editor.chain().focus();
    if (id === "paragraph") chain.setParagraph().run();
    else chain.setHeading({ level: id === "h2" ? 2 : 3 }).run();
  };

  return (
    <div className="overflow-hidden rounded-[10px] border-[1.5px] border-bo-field focus-within:border-bo-cyan focus-within:shadow-[0_0_0_4px_#E0F8F6]">
      <div
        role="toolbar"
        aria-label="Mise en forme"
        className="flex flex-wrap items-center gap-0.5 border-b border-bo-line bg-bo-bg-2 px-2 py-1.5"
      >
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger
            onMouseDown={(event) => event.preventDefault()}
            className="h-10 cursor-pointer rounded-[7px] border-none bg-white px-2.5 font-[inherit] text-[13px] font-bold text-bo-ink shadow-[0_0_0_1px_#E3E8EC]"
          >
            {blockLabel} ▾
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="start"
              sideOffset={6}
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                editor?.commands.focus();
              }}
              className="z-50 flex min-w-[200px] flex-col gap-0.5 rounded-xl border border-bo-line bg-white p-1.5 font-sans text-bo-ink shadow-[0_12px_32px_rgba(9,32,37,0.16)]"
            >
              {BLOCK_TYPES.map((type) => (
                <DropdownMenu.Item
                  key={type.id}
                  onSelect={() => setBlockType(type.id)}
                  className={cn(
                    "flex h-10 cursor-pointer items-center rounded-lg px-3 outline-none data-[highlighted]:bg-bo-bg",
                    type.id === "paragraph" && "text-[15px]",
                    type.id === "h2" && "text-[18px] font-bold",
                    type.id === "h3" && "text-base font-bold",
                    blockType === type.id && "text-bo-teal"
                  )}
                >
                  {type.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <Separator />
        <ToolbarButton label="Gras" active={state?.bold} onClick={() => editor?.chain().focus().toggleBold().run()}>
          <span className="text-[15px] font-black">B</span>
        </ToolbarButton>
        <ToolbarButton label="Italique" active={state?.italic} onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <span className="font-[Georgia,serif] text-base italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          label="Intertitre"
          active={state?.h2}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <span className="text-sm font-bold">H2</span>
        </ToolbarButton>
        <ToolbarButton
          label="Liste à puces"
          active={state?.bullet}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <Icon name="list" />
        </ToolbarButton>
        <ToolbarButton
          label="Citation"
          active={state?.quote}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Icon name="quote" />
        </ToolbarButton>
        <ToolbarButton label="Lien" active={state?.link} onClick={() => setLinkOpen(true)}>
          <Icon name="link" />
        </ToolbarButton>
        <Separator />
        <ToolbarButton label="Insérer une image" onClick={() => fileInputRef.current?.click()}>
          <Icon name="image" />
        </ToolbarButton>
        <ToolbarButton label="Insérer une vidéo" onClick={() => setVideoOpen(true)}>
          <Icon name="video" />
        </ToolbarButton>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setWhatsappOpen(true)}
          className="ml-auto inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[7px] border-none bg-bo-teal-soft px-3 font-[inherit] text-[13px] font-bold text-bo-teal hover:brightness-95"
        >
          <Icon name="whatsapp" size={16} />
          Coller un post WhatsApp
        </button>
      </div>

      <div ref={wrapperRef} className="relative px-7 py-6">
        <EditorContent editor={editor} />
        {!editor ? <div className="news-content min-h-[232px]" aria-hidden="true" /> : null}

        {slash ? (
          <div
            role="listbox"
            aria-label="Insérer un bloc"
            className="absolute z-20 flex w-[280px] flex-col gap-0.5 rounded-xl border border-bo-line bg-white p-1.5 shadow-[0_12px_32px_rgba(9,32,37,0.16)]"
            style={{ top: slash.top, left: slash.left }}
          >
            {SLASH_ITEMS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={index === slashIndex}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setSlashIndex(index)}
                onClick={() => runSlash(item)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border-none bg-transparent px-2.5 py-2 text-left font-[inherit] text-bo-ink",
                  index === slashIndex && "bg-bo-bg"
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-bo-line bg-white text-[13px] font-bold">
                  {item.icon === "h2" ? "H2" : item.icon === "h3" ? "H3" : <Icon name={item.icon} size={16} />}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-bold leading-[1.3]">{item.label}</span>
                  <span className="text-xs text-bo-muted">{item.hint}</span>
                </span>
              </button>
            ))}
          </div>
        ) : null}

        {uploading > 0 ? (
          <p role="status" className="m-0 mt-3 text-[13px] font-bold text-bo-teal">
            Envoi de {uploading > 1 ? `${uploading} images` : "l'image"}…
          </p>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = "";
          if (editor && files.length) void insertImages(editor, files);
        }}
      />

      <PromptDialog
        open={linkOpen}
        onOpenChange={setLinkOpen}
        title="Insérer un lien"
        description="Laissez vide pour retirer le lien du texte sélectionné."
        label="Adresse du lien"
        placeholder="https://…"
        initialValue={editor?.getAttributes("link").href ?? ""}
        confirmLabel="Appliquer"
        onSubmit={(value) => {
          if (!editor) return;
          if (!value) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }
          const href = normalizeUrl(value);
          if (editor.state.selection.empty && !editor.isActive("link")) {
            const safe = escapeAttribute(href);
            editor.chain().focus().insertContent(`<a href="${safe}">${safe}</a> `).run();
          } else {
            editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
          }
        }}
      />

      <PromptDialog
        open={videoOpen}
        onOpenChange={setVideoOpen}
        title="Insérer une vidéo"
        description="La vidéo YouTube est intégrée dans l'article."
        label="Lien de la vidéo YouTube"
        placeholder="https://www.youtube.com/watch?v=…"
        confirmLabel="Insérer"
        validate={(value) => (YOUTUBE_URL.test(value) ? null : "Collez le lien d'une vidéo YouTube.")}
        onSubmit={(value) => editor?.chain().focus().setYoutubeVideo({ src: value }).run()}
      />

      <PromptDialog
        open={whatsappOpen}
        onOpenChange={setWhatsappOpen}
        title="Coller un post WhatsApp"
        description="Le texte est inséré à l'emplacement du curseur : *gras*, _italique_, listes et liens sont convertis."
        label="Texte du post"
        placeholder="Collez ici le texte copié depuis la chaîne…"
        confirmLabel="Insérer"
        multiline
        validate={(value) => (value ? null : "Collez le texte du post.")}
        onSubmit={(value) => {
          const html = whatsappTextToHtml(value, {
            convertFormatting: true,
            removeHashtags: false,
            removeEmojis: false,
          });
          editor?.chain().focus().insertContent(html).run();
        }}
      />
    </div>
  );
}
