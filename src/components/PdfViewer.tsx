"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";

export default function PdfViewer({ url, title }: { url: string; title: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    import("pdfjs-dist").then(async (pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
      try {
        const doc = await pdfjs.getDocument({ url, withCredentials: false }).promise;
        if (cancelled) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setCurrentPage(1);
        setLoading(false);
      } catch {
        if (!cancelled) setError("Could not load PDF. Please try again.");
      }
    });

    return () => { cancelled = true; };
  }, [url]);

  const renderPage = useCallback(async (doc: any, pageNum: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!canvasRef.current || !doc) return;

    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }

    const page = await doc.getPage(pageNum);
    const container = canvasRef.current.parentElement;
    const containerWidth = container ? container.clientWidth - 16 : window.innerWidth - 16;
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = containerWidth / baseViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const task = page.render({ canvasContext: ctx, viewport });
    renderTaskRef.current = task;
    try {
      await task.promise;
    } catch {
      // render cancelled — ignore
    }
  }, []);

  useEffect(() => {
    if (pdfDoc) renderPage(pdfDoc, currentPage);
  }, [pdfDoc, currentPage, renderPage]);

  const goTo = (n: number) => setCurrentPage(Math.max(1, Math.min(totalPages, n)));

  if (loading) return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader size={28} className="animate-spin" style={{ color: "var(--teal)" }} />
      <p className="text-sm" style={{ color: "rgba(26,26,26,0.5)" }}>Loading PDF…</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center py-16">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full" style={{ minHeight: 0 }}>
      {/* Page navigation */}
      <div className="flex items-center justify-center gap-4 py-2 flex-shrink-0" style={{ borderBottom: "1px solid rgba(15,76,92,0.08)" }}>
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30"
          style={{ border: "1px solid rgba(15,76,92,0.18)" }}
        >
          <ChevronLeft size={16} style={{ color: "var(--navy)" }} />
        </button>
        <span className="text-xs font-medium" style={{ color: "var(--navy)" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30"
          style={{ border: "1px solid rgba(15,76,92,0.18)" }}
        >
          <ChevronRight size={16} style={{ color: "var(--navy)" }} />
        </button>
      </div>
      {/* Canvas */}
      <div className="flex-1 overflow-auto flex justify-center bg-gray-100 p-2" style={{ minHeight: 0 }}>
        <canvas
          ref={canvasRef}
          style={{ maxWidth: "100%", height: "auto", display: "block", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
          aria-label={`${title} — page ${currentPage}`}
        />
      </div>
    </div>
  );
}
