import { useEffect } from "react";

export const useDocumentTitle = (title) => {
  useEffect(() => {
    if (!title) return; // ← guard: skip if undefined/null/empty
    document.title = title;
  }, [title]);
};
