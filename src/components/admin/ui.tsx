"use client";

import { Dialog } from "radix-ui";
import { useId, useRef, useState, type ReactNode } from "react";

import { effectiveStatus, STATUS_STYLES, type NewsStatus } from "@/lib/news/types";
import { cn } from "@/lib/utils";

import { Icon } from "./icons";

/** Champ de saisie standard de la maquette (bordure 1.5px #D9E0E6, rayon 10px). */
export const fieldClass =
  "w-full rounded-[10px] border-[1.5px] border-bo-field bg-white px-4 font-[inherit] text-[15px] text-bo-ink outline-none transition-[border-color,box-shadow] placeholder:text-bo-faint focus:border-bo-cyan focus:shadow-[0_0_0_4px_#E0F8F6] aria-invalid:border-bo-danger";

export const cardClass = "rounded-[14px] border border-bo-line bg-white";

export const primaryButtonClass =
  "inline-flex h-[46px] items-center justify-center gap-2.5 rounded-[10px] bg-bo-cyan px-5 font-bold text-bo-night no-underline transition-[filter] hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bo-teal-soft disabled:cursor-not-allowed disabled:opacity-60";

export const outlineButtonClass =
  "inline-flex h-[46px] items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] border-bo-teal bg-white px-[18px] font-bold text-bo-teal no-underline transition-colors hover:bg-bo-teal-wash focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bo-teal-soft disabled:cursor-not-allowed disabled:opacity-60";

export function StatusBadge({
  status,
  publishedAt = null,
}: {
  status: NewsStatus;
  publishedAt?: string | null;
}) {
  const style = STATUS_STYLES[effectiveStatus(status, publishedAt)];
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[13px] font-bold leading-[1.5]"
      style={{ background: style.bg, color: style.fg }}
    >
      <span className="size-1.5 rounded-full" style={{ background: style.fg }} />
      {style.label}
    </span>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex h-[30px] w-[52px] shrink-0 cursor-pointer rounded-full border-none p-[3px] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bo-teal-soft",
        checked ? "justify-end bg-bo-teal" : "justify-start bg-bo-off"
      )}
    >
      <span className="size-6 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
    </button>
  );
}

function DialogShell({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bo-night/55 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 flex-col gap-5 overflow-y-auto rounded-[14px] bg-white p-6 font-sans text-[15px] leading-[1.5] text-bo-ink shadow-[0_24px_64px_rgba(9,32,37,0.25)] focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex flex-col gap-1.5 pr-10">
            <Dialog.Title className="m-0 text-xl font-black">{title}</Dialog.Title>
            {description ? (
              <Dialog.Description className="m-0 text-bo-muted">{description}</Dialog.Description>
            ) : (
              <Dialog.Description className="sr-only">{title}</Dialog.Description>
            )}
          </div>
          {children}
          <Dialog.Close
            aria-label="Fermer"
            className="absolute right-3 top-3 flex size-11 cursor-pointer items-center justify-center rounded-[10px] border-none bg-transparent text-bo-slate hover:bg-bo-bg"
          >
            <Icon name="x" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  danger = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => Promise<void> | void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <DialogShell open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <div className="flex flex-wrap justify-end gap-2.5">
        <Dialog.Close className="h-[46px] cursor-pointer rounded-[10px] border-none bg-transparent px-4 font-bold text-bo-ink hover:bg-bo-bg">
          Annuler
        </Dialog.Close>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm();
            } finally {
              setBusy(false);
            }
          }}
          className={cn(
            "h-[46px] cursor-pointer rounded-[10px] border-none px-5 font-bold disabled:cursor-wait disabled:opacity-60",
            danger ? "bg-bo-danger text-white hover:brightness-110" : "bg-bo-cyan text-bo-night hover:brightness-95"
          )}
        >
          {busy ? "Patientez…" : confirmLabel}
        </button>
      </div>
    </DialogShell>
  );
}

type PromptProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  label: string;
  placeholder?: string;
  initialValue?: string;
  confirmLabel: string;
  multiline?: boolean;
  validate?: (value: string) => string | null;
  onSubmit: (value: string) => void;
};

export function PromptDialog(props: PromptProps) {
  return (
    <DialogShell
      open={props.open}
      onOpenChange={props.onOpenChange}
      title={props.title}
      description={props.description}
    >
      {/* Remonté à chaque ouverture pour repartir de la valeur initiale. */}
      {props.open ? <PromptForm {...props} /> : null}
    </DialogShell>
  );
}

function PromptForm({
  onOpenChange,
  label,
  placeholder,
  initialValue = "",
  confirmLabel,
  multiline = false,
  validate,
  onSubmit,
}: PromptProps) {
  const id = useId();
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const fieldRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        const message = validate?.(value.trim()) ?? null;
        if (message) {
          setError(message);
          fieldRef.current?.focus();
          return;
        }
        onSubmit(value.trim());
        onOpenChange(false);
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-sm font-bold">
          {label}
        </label>
        {multiline ? (
          <textarea
            id={id}
            ref={fieldRef}
            rows={8}
            value={value}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            onChange={(event) => setValue(event.target.value)}
            className={cn(fieldClass, "resize-y bg-bo-bg-2 py-3.5 leading-[1.6]")}
          />
        ) : (
          <input
            id={id}
            ref={fieldRef}
            type="text"
            value={value}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            onChange={(event) => setValue(event.target.value)}
            className={cn(fieldClass, "h-[46px]")}
          />
        )}
        {error ? (
          <span role="alert" className="text-[13px] font-bold text-bo-danger">
            {error}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap justify-end gap-2.5">
        <Dialog.Close
          type="button"
          className="h-[46px] cursor-pointer rounded-[10px] border-none bg-transparent px-4 font-bold text-bo-ink hover:bg-bo-bg"
        >
          Annuler
        </Dialog.Close>
        <button type="submit" className={cn(primaryButtonClass, "cursor-pointer border-none")}>
          {confirmLabel}
        </button>
      </div>
    </form>
  );
}
