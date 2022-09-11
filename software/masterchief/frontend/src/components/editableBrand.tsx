import { useRef } from 'react';
import { useDiscBrandMutation } from '../graphql';
import ContentEditable from 'react-contenteditable';

export function EditableBrand({
  brand,
  discId,
}: {
  brand: string;
  discId: string;
}) {
  const newBrand = useRef(brand);
  const [update, { loading: saving }] = useDiscBrandMutation();

  return (
    <ContentEditable
      className="inline"
      html={newBrand.current}
      disabled={saving}
      onChange={(e) => (newBrand.current = e.target.value)}
      onBlur={() => {
        if (brand === newBrand.current) {
          console.log('the same brand, not doing anything');
          return;
        }
        update({
          variables: {
            input: {
              discId,
              brand: newBrand.current,
            },
          },
        });
      }}
    />
  );
}
