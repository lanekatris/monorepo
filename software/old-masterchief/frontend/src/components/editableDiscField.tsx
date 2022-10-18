import { DiscUpdateInput, useDiscUpdateMutation } from '../graphql';
import { InlineEditableField } from './inlineEditableField';

export function EditableDiscField({
  name,
  value,
  discId,
}: {
  name: keyof DiscUpdateInput;
  value: string;
  discId: string;
}) {
  const [update, { loading: saving }] = useDiscUpdateMutation();
  return (
    <InlineEditableField
      value={value}
      onUpdate={async (newValue: string) => {
        await update({
          variables: {
            input: {
              id: discId,
              [name]: newValue,
            },
          },
        });
      }}
      saving={saving}
    />
  );
}
