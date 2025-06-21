import { cn } from "@/utils/cn";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  className?: string;
}
const Modal = ({ children, isOpen, setIsOpen, className = "" }: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      // Add Escape key listener
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
      };

      document.addEventListener("keydown", handleKeyDown);

      // Cleanup
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed w-screen h-screen flex justify-center items-center">
      <div
        className="absolute w-full h-full bg-black opacity-50 z-40"
        onClick={() => setIsOpen(false)}
      ></div>
      <div
        className={cn(
          "bg-white rounded-lg p-5 z-50 w-full  max-w-[95vw] md:max-w-[700px] relative space-y-4",
          className
        )}
      >
        <button
          className="absolute top-4 left-4"
          type="button"
          onClick={() => setIsOpen(false)}
        >
          <IoClose size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};
export default Modal;
