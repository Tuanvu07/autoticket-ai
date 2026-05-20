// ═══════════════════════════════════════════════════════════════
//  HOOK: useOCRCamera — CCCD Scanning with Auto-Fill
//  ───────────────────────────────────────────────────────────────
//  Manages camera access, image capture, compression, and API calls.
//  Returns extracted CCCD data for auto-filling form fields.
// ═══════════════════════════════════════════════════════════════

import { useRef, useCallback, useState } from "react";
import { compressImage } from "@/lib/imageCompression";

export interface OCRResult {
  success: boolean;
  data?: {
    name: string;
    cccd: string;
    dob: string; // DD/MM/YYYY
    address: string;
    gender?: string;
    nationality?: string;
  };
  error?: string;
  processingTime?: number;
}

interface UseOCRCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isLoading: boolean;
  error: string | null;
  isCameraReady: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureAndProcess: () => Promise<OCRResult | null>;
  resetError: () => void;
}

const OCR_API_ENDPOINT = "/api/ocr/cccd";

export function useOCRCamera(): UseOCRCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // ──────────────────────────────────────────────────────────
  // START CAMERA
  // ──────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      setError(null);

      // Request camera access (rear/environment camera for mobile)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Wait for video to load
        await new Promise<void>((resolve) => {
          const onLoadedMetadata = () => {
            videoRef.current?.removeEventListener(
              "loadedmetadata",
              onLoadedMetadata
            );
            setIsCameraReady(true);
            resolve();
          };
          videoRef.current?.addEventListener("loadedmetadata", onLoadedMetadata);
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể truy cập camera";
      setError(message);
      console.error("[Camera Error]", err);
    }
  }, []);

  // ──────────────────────────────────────────────────────────
  // STOP CAMERA
  // ──────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsCameraReady(false);
    }
  }, []);

  // ──────────────────────────────────────────────────────────
  // CAPTURE & PROCESS CCCD
  // ──────────────────────────────────────────────────────────
  const captureAndProcess = useCallback(async (): Promise<OCRResult | null> => {
    if (!videoRef.current || !canvasRef.current) {
      setError("Camera không sẵn sàng");
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 1. Capture frame from video stream
      const context = canvasRef.current.getContext("2d");
      if (!context) {
        throw new Error("Cannot get canvas context");
      }

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      // 2. Get base64 from canvas
      let base64Image = canvasRef.current.toDataURL("image/jpeg");

      // 3. Compress image (target: < 1MB)
      base64Image = await compressImage(base64Image, 1024, 768, 0.85);

      // 4. Send to OCR API
      const response = await fetch(OCR_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          provider: "mock", // Change to "fptai", "google", or "zaloai" in production
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: OCR xử lý thất bại`
        );
      }

      const result = (await response.json()) as OCRResult;

      if (!result.success) {
        throw new Error(result.error || "OCR extraction failed");
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lỗi không xác định";
      setError(message);
      console.error("[OCR Processing Error]", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ──────────────────────────────────────────────────────────
  // RESET ERROR
  // ──────────────────────────────────────────────────────────
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    videoRef,
    canvasRef,
    isLoading,
    error,
    isCameraReady,
    startCamera,
    stopCamera,
    captureAndProcess,
    resetError,
  };
}
