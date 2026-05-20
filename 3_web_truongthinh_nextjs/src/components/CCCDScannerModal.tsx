"use client";

import { useEffect, useState } from "react";
import { useOCRCamera, type OCRResult } from "@/hooks/useOCRCamera";
import { Camera, X, AlertCircle, Loader2, CheckCircle2, Zap } from "lucide-react";

interface CCCDScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataExtracted: (data: {
    name: string;
    cccd: string;
    address: string;
  }) => void;
}

export default function CCCDScannerModal({
  isOpen,
  onClose,
  onDataExtracted,
}: CCCDScannerModalProps) {
  const {
    videoRef,
    canvasRef,
    isLoading,
    error,
    isCameraReady,
    startCamera,
    stopCamera,
    captureAndProcess,
    resetError,
  } = useOCRCamera();

  const [step, setStep] = useState<"init" | "camera" | "processing" | "success">(
    "init"
  );
  const [extractedResult, setExtractedResult] = useState<OCRResult | null>(null);

  // Auto-open camera on mount
  useEffect(() => {
    if (isOpen && step === "init") {
      setStep("camera");
      startCamera().catch(console.error);
    }
  }, [isOpen, step, startCamera]);

  // Cleanup camera on close
  useEffect(() => {
    return () => {
      if (!isOpen) {
        stopCamera();
      }
    };
  }, [isOpen, stopCamera]);

  const handleCapture = async () => {
    setStep("processing");
    const result = await captureAndProcess();

    if (result?.success && result.data) {
      setExtractedResult(result);
      setStep("success");

      // Auto-submit after 1.5 seconds
      setTimeout(() => {
        handleConfirm(result);
      }, 1500);
    } else {
      // Stay on camera step if capture failed
      setStep("camera");
    }
  };

  const handleConfirm = (result: OCRResult) => {
    if (result.data) {
      onDataExtracted({
        name: result.data.name,
        cccd: result.data.cccd,
        address: result.data.address,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setStep("init");
    setExtractedResult(null);
    resetError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        {/* ══ HEADER ══ */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">
              Quét CCCD
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 p-1.5 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ══ BODY ══ */}
        <div className="p-6">
          {step === "camera" && (
            <>
              <div className="space-y-4">
                <p className="text-sm text-brand-muted leading-relaxed">
                  🤖 Hướng camera vào mặt trước CCCD của bạn. AI sẽ tự động bóc tách dữ liệu.
                </p>

                {/* Video stream container */}
                <div className="relative bg-black rounded-2xl overflow-hidden aspect-video shadow-lg border-2 border-emerald-400">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay guide frame */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-2 border-emerald-400/60 rounded-2xl w-4/5 h-32 opacity-50" />
                  </div>

                  {/* Corner brackets */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-emerald-400" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-emerald-400" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-emerald-400" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-emerald-400" />

                  {!isCameraReady && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Hidden canvas for capture */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-red-700">
                        Lỗi Camera
                      </p>
                      <p className="text-xs text-red-600 mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                {/* Capture button */}
                <button
                  onClick={handleCapture}
                  disabled={!isCameraReady || isLoading}
                  className={`w-full py-3.5 rounded-xl font-bold text-white text-sm uppercase tracking-wider transition-all duration-200
                    ${
                      isCameraReady
                        ? "bg-emerald-500 hover:bg-emerald-600 active:scale-95 shadow-lg"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Camera className="w-4 h-4" />
                      Chụp & Bóc Tách Dữ Liệu
                    </span>
                  )}
                </button>

                <button
                  onClick={handleClose}
                  className="w-full py-2.5 rounded-lg border border-brand-border text-brand-text font-semibold text-sm transition-all hover:bg-gray-50"
                >
                  Hủy
                </button>
              </div>
            </>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
              </div>
              <div className="text-center">
                <p className="font-bold text-brand-text">
                  🤖 AI Đang Bóc Tách Dữ Liệu
                </p>
                <p className="text-xs text-brand-muted mt-1">
                  Vui lòng chờ {extractedResult?.processingTime ? `(${extractedResult.processingTime}ms)` : ""}
                </p>
              </div>
            </div>
          )}

          {step === "success" && extractedResult?.data && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                <p className="font-bold text-brand-text text-center">
                  ✨ Bóc Tách Thành Công!
                </p>
              </div>

              {/* Extracted data preview */}
              <div className="space-y-3 bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div>
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mb-1">
                    Họ & Tên
                  </p>
                  <p className="text-sm font-bold text-brand-text">
                    {extractedResult.data.name}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mb-1">
                    Số CCCD
                  </p>
                  <p className="text-sm font-bold text-brand-text">
                    {extractedResult.data.cccd}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mb-1">
                    Địa Chỉ
                  </p>
                  <p className="text-xs text-brand-text leading-relaxed">
                    {extractedResult.data.address}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep("camera");
                    resetError();
                  }}
                  className="flex-1 py-2.5 rounded-lg border border-brand-border text-brand-text font-semibold text-sm hover:bg-gray-50 transition-all"
                >
                  Quét Lại
                </button>
                <button
                  onClick={() => handleConfirm(extractedResult)}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Dùng Dữ Liệu Này
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
