// src/hooks/useAutoSave.js
"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/stores/editorStore";

export function useAutoSave() {
  const { triggerAutoSave, autoSaveInterval, autoSaveEnabled, isDirty } =
    useEditorStore();

  useEffect(() => {
    if (!autoSaveEnabled) return;

    const interval = setInterval(() => {
      if (isDirty) {
        triggerAutoSave();
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [triggerAutoSave, autoSaveInterval, autoSaveEnabled, isDirty]);
}
