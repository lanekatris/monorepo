'use client';

import { GoMoveToTop } from 'react-icons/go';
import styles from './GoToTop.module.css';
import { useEffect, useState } from 'react';

export function GoToTop() {
  const [showGoTop, setShowGoTop] = useState(false);
  const handleVisibleButton = () => {
    setShowGoTop(window.pageYOffset > 100);
  };

  const handleScrollUp = () => {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const e = window.addEventListener('scroll', handleVisibleButton);

    return () => window.removeEventListener('scroll', handleVisibleButton);
  }, []);
  return (
    <button className={styles.GoToTop} onClick={handleScrollUp}>
      <GoMoveToTop size={'2em'} />
    </button>
  );
}
