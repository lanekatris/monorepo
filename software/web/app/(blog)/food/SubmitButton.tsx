'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      style={{
        background: 'none', //; /* Removes button background */
        color: 'var(--accent)', //; /* Matcha's primary link color */
        textDecoration: 'underline', //; /* Mimic hyperlink style */
        border: 'none', //; /* Removes button border */
        padding: 0 //; /* Optional: refine padding for link-like appearance */
      }}
    >
      Clear
    </button>
  );
}
