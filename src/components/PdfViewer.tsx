"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader, Maximize2, Minimize2 } from "lucide-react";

const PDFJS_VERSION = "3.11.174";
const PDFJS_CDN = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
const PDFJS_WORKER = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export default function PdfViewer({ url, title }: { url: string; title: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTaskRef = useRef<any>(null);

  // Load PDF.js from CDN
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    loadScript(PDFJS_CDN).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      return pdfjsLib.getDocument({ url }).promise;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).then((doc: any) => {
      if (cancelled) return;
      setPdfDoc(doc);
      setTotalPages(doc.numPages);
      setCurrentPage(1);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setError("Could not load PDF. Please try again.");
    });

    return () => { cancelled = true; };
  }, [url]);

  // Track fullscreen state
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderPage = useCallback(async (doc: any, pageNum: number) => {
    if (!canvasRef.current || !doc) return;
    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel(); } catch { /* ignore */ }
      renderTaskRef.current = null;
    }

    const page = await doc.getPage(pageNum);
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const containerWidth = container ? container.clientWidth - 16 : window.innerWidth - 16;

    const baseViewport = page.getViewport({ scale: 1 });
    const cssScale = containerWidth / baseViewport.width;

    // Render at device pixel ratio for sharp display on retina/high-DPI screens
    const dpr = window.devicePixelRatio || 1;
    const renderScale = cssScale * dpr;
    const viewport = page.getViewport({ scale: renderScale });

    // Set canvas actual pixel size to high-res
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Scale canvas CSS size back down so it fits the container
    canvas.style.width = `${viewport.width / dpr}px`;
    canvas.style.height = `${viewport.height / dpr}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const task = page.render({ canvasContext: ctx, viewport });
    renderTaskRef.current = task;
    try { await task.promise; } catch { /* render cancelled */ }
  }, []);

  useEffect(() => {
    if (pdfDoc) renderPage(pdfDoc, currentPage);
  }, [pdfDoc, currentPage, renderPage]);

  const goTo = (n: number) => setCurrentPage(Math.max(1, Math.min(totalPages, n)));

  const openFullscreen = () => {
    const el = containerRef.current as HTMLDivElement & {
      mozRequestFullScreen?: () => void;
      webkitRequestFullscreen?: () => void;
    } | null;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  const exitFullscreen = () => {
    const doc = document as Document & {
      mozCancelFullScreen?: () => void;
      webkitExitFullscreen?: () => void;
    };
    if (doc.exitFullscreen) doc.exitFullscreen();
    else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
    else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
  };

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
    <div ref={containerRef} className="flex flex-col w-full h-full bg-white" style={{ minHeight: 0 }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 flex-shrink-0" style={{ borderBottom: "1px solid rgba(15,76,92,0.1)" }}>
        {/* Page navigation */}
        <div className="flex items-center gap-3">
          <button onClick={() => goTo(currentPage - 1)} disabled={currentPage <= 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30"
            style={{ border: "1px solid rgba(15,76,92,0.2)" }}>
            <ChevronLeft size={16} style={{ color: "var(--navy)" }} />
          </button>
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: "var(--navy)" }}>
            {currentPage} / {totalPages}
          </span>
          <button onClick={() => goTo(currentPage + 1)} disabled={currentPage >= totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30"
            style={{ border: "1px solid rgba(15,76,92,0.2)" }}>
            <ChevronRight size={16} style={{ color: "var(--navy)" }} />
          </button>
        </div>

        {/* Fullscreen toggle */}
        <button
          onClick={isFullscreen ? exitFullscreen : openFullscreen}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ border: "1px solid rgba(15,76,92,0.2)" }}
        >
          {isFullscreen
            ? <Minimize2 size={15} style={{ color: "var(--navy)" }} />
            : <Maximize2 size={15} style={{ color: "var(--navy)" }} />}
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto flex justify-center bg-gray-100 p-2" style={{ minHeight: 0 }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", maxWidth: "100%" }}
          aria-label={`${title} — page ${currentPage}`}
        />
      </div>
    </div>
  );
}
