import { useDiscBrandMutation } from '../graphql';
import { InlineEditableField } from './inlineEditableField';

export function EditableBrand({
  brand,
  discId,
}: {
  brand: string;
  discId: string;
}) {
  const [update, { loading: saving }] = useDiscBrandMutation();
  return (
    <InlineEditableField
      value={brand}
      onUpdate={(newValue: string) => {
        update({
          variables: {
            input: {
              discId,
              brand: newValue,
            },
          },
        });
      }}
      saving={saving}
    />
  );
}
