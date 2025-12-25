// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

const ExampleWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="px-4 py-64 bg-slate-900 grid place-content-center">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium px-4 py-2 rounded hover:opacity-90 transition-opacity"
      >
        Open Modal
      </button>
      <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

const SpringModal = ({ 
  isOpen, 
  setIsOpen, 
  title = "One more thing!", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "default" // "default" | "danger"
}) => {
  const isDanger = variant === "danger";
  
  const gradientClass = isDanger 
    ? "bg-gradient-to-br from-red-600 to-rose-700" 
    : "bg-gradient-to-br from-violet-600 to-indigo-600";
  
  const iconBgClass = isDanger ? "text-red-600" : "text-indigo-600";
  const confirmBtnClass = isDanger 
    ? "bg-white hover:opacity-90 transition-opacity text-red-600 font-semibold w-full py-2 rounded"
    : "bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded";

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className={`${gradientClass} text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden`}
          >
            <AlertCircle className="text-white/10 rotate-12 absolute z-0 -top-24 -left-24" size={250} strokeWidth={1} />
            <div className="relative z-10">
              <div className={`bg-white w-16 h-16 mb-2 rounded-full ${iconBgClass} grid place-items-center mx-auto`}>
                <AlertCircle size={32} />
              </div>
              <h3 className="text-3xl font-bold text-center mb-2">
                {title}
              </h3>
              <p className="text-center mb-6">
                {message}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={confirmBtnClass}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { SpringModal };
export default ExampleWrapper;