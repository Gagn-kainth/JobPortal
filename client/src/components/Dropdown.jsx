import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

const Dropdown = ({ options, value, onChange, className = "" }) => {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // Calculate menu position relative to viewport
  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      setMenuPos({
        top: rect.bottom + scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on scroll/resize
  useEffect(() => {
    if (!open) return;
    const handleClose = () => setOpen(false);
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);
    return () => {
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  const menu = (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        top: menuPos?.top ?? 0,
        left: menuPos?.left ?? 0,
        width: menuPos?.width ?? "auto",
        zIndex: 9999,
      }}
      className="bg-white border border-[#D8D8D8] rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="py-1 max-h-60 overflow-y-auto">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
              value === opt.value
                ? "bg-orange-50 text-[#FF6B00] font-medium"
                : "text-gray-700 hover:bg-orange-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className={`relative ${className}`} ref={triggerRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full h-11 px-3.5 rounded-2xl border border-[#D8D8D8] text-sm bg-white
                     flex items-center justify-between
                     focus:outline-none focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10
                     transition-shadow duration-150"
        >
          {selected?.label || "Select"}
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      {open && menuPos && createPortal(menu, document.body)}
    </>
  );
};

export default Dropdown;