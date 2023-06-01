import { useEventEditMessageMutation } from '../graphql';
import { InlineEditableField } from './inlineEditableField';

export function EditableEventMessage({
  value,
  eventId,
}: // onUpdate,
{
  value: string;
  eventId: string;
  // onUpdate: () => void;
}) {
  const [update, { loading: saving }] = useEventEditMessageMutation();
  return (
    <InlineEditableField
      value={value}
      onUpdate={async (newValue) => {
        await update({
          variables: {
            input: {
              eventId,
              message: newValue,
            },
          },
        });
      }}
      saving={saving}
    />
  );
}
