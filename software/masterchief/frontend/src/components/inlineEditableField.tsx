import { useRef } from 'react';
import ContentEditable from 'react-contenteditable';

export function InlineEditableField({
  value,
  onUpdate,
  saving,
}: {
  value: string;
  onUpdate: (newValue: string) => void;
  saving: boolean;
}) {
  const newValue = useRef(value);

  return (
    <ContentEditable
      className="inline"
      html={newValue.current}
      disabled={saving}
      onChange={(e) => (newValue.current = e.target.value)}
      onBlur={() => {
        if (value === newValue.current) {
          console.log('the same value, not doing anything');
          return;
        }
        onUpdate(newValue.current);
      }}
    />
  );
}
