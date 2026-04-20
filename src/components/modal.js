"use client";

import { X } from "lucide-react";
import { Button, Card } from "@/components/ui";

export function Modal({ open, title, description, children, footer, onClose, maxWidth = "max-w-3xl" }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-3 py-3 backdrop-blur-sm md:items-center md:px-6">
      <Card className={`flex max-h-[92vh] w-full ${maxWidth} flex-col overflow-hidden p-0 shadow-2xl`}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
            {description ? (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footer ? <div className="border-t border-slate-200 p-4 dark:border-slate-800">{footer}</div> : null}
      </Card>
    </div>
  );
}
