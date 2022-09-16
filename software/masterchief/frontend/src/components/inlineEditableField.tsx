import { useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { AiOutlineTag } from 'react-icons/all';
import { useEventAddTagMutation } from '../graphql';

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

  // todo: useeffect here that keeps track of the value passed in so its not stale

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

// @ts-ignore
export function InlineEditableTag({ value, className, eventId, onUpdate }) {
  const newValue = useRef(value);
  const [add] = useEventAddTagMutation();
  return (
    <div className={className} style={{ display: 'flex' }}>
      <AiOutlineTag />
      <ContentEditable
        html={newValue.current}
        onChange={(e) => (newValue.current = e.target.value)}
        onBlur={async () => {
          console.log('save me');
          await add({
            variables: {
              input: {
                eventId,
                tag: newValue.current,
              },
            },
          });
          newValue.current = 'Add Tag';
          onUpdate?.();
        }}
      />
    </div>
  );

  // return <a>Tags</a>;
}
