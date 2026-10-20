import React from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children, maxWidth = '560px', ariaLabel }) {
  return createPortal(
    <div className="modal-overlay">
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
