"use client";

import { useState, type ReactNode } from "react";

export const inputCls =
  "mt-1 w-full rounded-md border border-forest-dark/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40";

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-medium text-ink/80">
      {label}
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  );
}

export function AreaField({
  label,
  value,
  onChange,
  rows = 3,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-ink/80">
      {label}
      <textarea
        required={required}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  );
}

/** Sehemu moja yenye masanduku mawili: Kiswahili na English */
export function BilingualField({
  label,
  sw,
  en,
  onSw,
  onEn,
  multiline = false,
  rows = 3,
  required = false,
}: {
  label: string;
  sw: string;
  en: string;
  onSw: (v: string) => void;
  onEn: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}) {
  const cols = [
    { name: "Kiswahili", value: sw, set: onSw },
    { name: "English", value: en, set: onEn },
  ];
  return (
    <div>
      <p className="text-sm font-medium text-ink/80">{label}</p>
      <div className="mt-1 grid gap-3 sm:grid-cols-2">
        {cols.map((c) => (
          <label key={c.name} className="block text-xs text-ink/50">
            {c.name}
            {multiline ? (
              <textarea
                required={required}
                rows={rows}
                value={c.value}
                onChange={(e) => c.set(e.target.value)}
                className={inputCls}
              />
            ) : (
              <input
                required={required}
                value={c.value}
                onChange={(e) => c.set(e.target.value)}
                className={inputCls}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

export function Notice({
  kind,
  children,
}: {
  kind: "ok" | "error";
  children: ReactNode;
}) {
  return (
    <p
      className={`rounded-md px-4 py-3 text-sm ${
        kind === "ok" ? "bg-leaf-light/40 text-forest-dark" : "bg-red-50 text-red-700"
      }`}
    >
      {children}
    </p>
  );
}

export function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.5 10.5 0 0 1 12 19c-6.5 0-10-7-10-7a17.7 17.7 0 0 1 4.06-5.06" />
      <path d="M9.9 5.24A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17.8 17.8 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
      <path d="M3 3l18 18" />
    </svg>
  );
}

/** Sehemu ya password yenye kitufe cha jicho cha kuonyesha/kuficha */
export function PasswordInput({
  label,
  value,
  onChange,
  autoComplete = "current-password",
  minLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  minLength?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="block text-sm font-medium text-ink/80">
      {label}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} pr-11`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ficha password" : "Onyesha password"}
          className="absolute inset-y-0 right-0 mt-1 flex items-center px-3 text-ink/50 transition hover:text-forest"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </label>
  );
}
