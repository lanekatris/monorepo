'use client';
import React, { useState } from 'react';

const CopyToClipboard = ({
  textToCopy = 'Default text to copy',
  buttonText = 'Copy',
  copiedText = 'Copied!'
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <a onClick={handleCopy} href="#">
      {isCopied ? copiedText : buttonText}
    </a>
  );
};

export default CopyToClipboard;
