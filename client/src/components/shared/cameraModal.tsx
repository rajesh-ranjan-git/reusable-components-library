import { useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "motion/react";
import { LuCamera, LuRefreshCw, LuX } from "react-icons/lu";

type CameraModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imgSrc: string) => void;
};

export default function CameraModal({
  isOpen,
  onClose,
  onCapture,
}: CameraModalProps) {
  const webcamRef = useRef<Webcam | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [webcamError, setWebcamError] = useState(false);

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current?.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const handleRetake = () => {
    setImgSrc(null);
    setWebcamError(false);
  };

  const handleConfirm = () => {
    if (imgSrc) onCapture(imgSrc);
    setImgSrc(null);
    onClose();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          key="camera-modal-wrapper"
          className="z-120 fixed inset-0 flex justify-center items-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative flex flex-col bg-white dark:bg-surface shadow-2xl border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 border-black/10 dark:border-white/10 border-b">
              <h2 className="font-semibold text-text-primary text-lg">
                Take a picture
              </h2>
              <button
                onClick={onClose}
                className="bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 p-1.5 rounded-lg text-text-secondary hover:text-text-primary transition-colors"
              >
                <LuX size={20} />
              </button>
            </div>

            <div className="flex flex-col justify-center items-center bg-black/5 dark:bg-black/50 p-4 min-h-75 md:min-h-100">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt="captured"
                  className="shadow-inner rounded-xl w-full object-cover"
                />
              ) : (
                <div className="relative flex justify-center items-center bg-black shadow-inner rounded-xl w-full min-h-75 overflow-hidden">
                  {!webcamError ? (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: "user" }}
                      className="w-full min-h-75 object-cover"
                      onUserMediaError={() => setWebcamError(true)}
                    />
                  ) : (
                    <div className="flex flex-col items-center p-6 text-text-primary text-center">
                      <LuCamera className="mb-3 w-12 h-12 text-black/20 dark:text-white/20" />
                      <p className="text-text-secondary">
                        Camera access denied or unavailable
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-center items-center gap-4 bg-black/5 dark:bg-white/5 p-4 border-black/10 dark:border-white/10 border-t">
              {imgSrc ? (
                <>
                  <button
                    onClick={handleRetake}
                    className="flex flex-1 justify-center items-center gap-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 py-3 border border-black/10 dark:border-white/10 rounded-xl font-medium text-text-primary dark:text-white text-sm transition-colors"
                  >
                    <LuRefreshCw size={18} /> Retake
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 bg-primary hover:bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] py-3 rounded-xl font-medium text-white text-sm transition-colors"
                  >
                    Use Photo
                  </button>
                </>
              ) : (
                <button
                  onClick={capture}
                  disabled={webcamError}
                  className="group flex justify-center items-center bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 disabled:opacity-50 border-2 border-black/20 hover:border-black/50 dark:border-white/50 dark:hover:border-white rounded-full w-16 h-16 transition-all disabled:cursor-not-allowed"
                  title="Capture"
                >
                  <div className="flex justify-center items-center bg-white shadow-md rounded-full w-12 h-12 group-hover:scale-95 transition-transform">
                    <LuCamera className="text-black" size={24} />
                  </div>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
