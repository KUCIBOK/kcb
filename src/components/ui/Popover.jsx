import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Popover Component
 * 
 * A versatile popover that opens on click and displays rich content
 * 
 * @example
 * <Popover
 *   trigger={<Button>Open Popover</Button>}
 *   title="Options"
 * >
 *   <div className="space-y-2">
 *     <button className="w-full text-left">Option 1</button>
 *     <button className="w-full text-left">Option 2</button>
 *   </div>
 * </Popover>
 * 
 * @example
 * <Popover
 *   trigger={<button><MoreVertical /></button>}
 *   placement="bottom-end"
 *   closeOnClickInside
 * >
 *   <ActionsMenu />
 * </Popover>
 */
export function Popover({
  trigger,
  children,
  title,
  placement = 'bottom', // 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'bottom-end' etc
  closeOnClickInside = false,
  closeOnEscape = true,
  showCloseButton = false,
  width = 'auto', // 'auto' | 'sm' | 'md' | 'lg' | number (px)
  offset = 8
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const widths = {
    auto: 'w-auto min-w-[200px]',
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96'
  };

  useEffect(() => {
    if (isOpen && triggerRef.current && popoverRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      // Parse placement (e.g., 'bottom-end' -> base='bottom', align='end')
      const [base, align] = placement.split('-');

      // Calculate base position
      switch (base) {
        case 'top':
          top = triggerRect.top - popoverRect.height - offset;
          left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + offset;
          left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
          left = triggerRect.left - popoverRect.width - offset;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
          left = triggerRect.right + offset;
          break;
        default:
          break;
      }

      // Apply alignment
      if (align === 'start') {
        if (base === 'top' || base === 'bottom') {
          left = triggerRect.left;
        } else {
          top = triggerRect.top;
        }
      } else if (align === 'end') {
        if (base === 'top' || base === 'bottom') {
          left = triggerRect.right - popoverRect.width;
        } else {
          top = triggerRect.bottom - popoverRect.height;
        }
      }

      // Keep popover within viewport
      const padding = 8;
      if (left < padding) left = padding;
      if (left + popoverRect.width > window.innerWidth - padding) {
        left = window.innerWidth - popoverRect.width - padding;
      }
      if (top < padding) top = padding;
      if (top + popoverRect.height > window.innerHeight - padding) {
        top = window.innerHeight - popoverRect.height - padding;
      }

      setPosition({ top, left });
    }
  }, [isOpen, placement, offset]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEscape]);

  const handleContentClick = () => {
    if (closeOnClickInside) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-block cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && (
        <>
          {/* Backdrop overlay (invisible, just to catch clicks) */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setIsOpen(false)}
          />

          {/* Popover content */}
          <div
            ref={popoverRef}
            className={`fixed z-[9999] bg-card border border-gray-700 rounded-lg shadow-xl
              ${typeof width === 'number' ? '' : widths[width]}
              animate-in fade-in slide-in-from-top-2 duration-200`}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              ...(typeof width === 'number' ? { width: `${width}px` } : {})
            }}
            onClick={handleContentClick}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                {title && <h3 className="font-semibold text-white">{title}</h3>}
                {showCloseButton && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-700 rounded transition"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              {children}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Popover;
