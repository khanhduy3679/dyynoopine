import { useEffect, useRef, useState } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (window.scrollY > 300) {
        setVisible(true);
        timeoutRef.current = setTimeout(() => setVisible(false), 300);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setVisible(false);
  };

  return (
    <button className={`scroll-top-btn ${visible ? 'visible' : ''}`} onClick={handleClick} aria-label="Lên đầu trang">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
