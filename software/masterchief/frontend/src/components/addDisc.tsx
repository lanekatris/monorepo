import { DiscCreateInput, useDiscCreateMutation } from '../graphql';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

export function AddDisc({ onSave }: { onSave?: () => void }) {
  const [create, { loading: saving, error }] = useDiscCreateMutation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<DiscCreateInput>();
  const onSubmit = async (input: DiscCreateInput) => {
    await create({ variables: { input } });
    onSave?.();
  };

  return (
    <section style={{ marginBottom: 0 }}>
      <details>
        <summary>Add Disc</summary>
        <p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              Brand
              <input
                {...register('brand', { required: true })}
                autoFocus
                placeholder="innova"
              />
            </label>

            <label>
              Model
              <input
                placeholder="sidewinder"
                {...register('model', { required: true })}
              />
            </label>

            <label>
              Color
              <input placeholder="red" {...register('color')} />
            </label>

            <label>
              Date <input type="date" {...register('date')} />
            </label>

            <ErrorMessage name="add-disc-errors" errors={errors} />
            {error && <article>{JSON.stringify(error, null, 2)}</article>}
            <div>
              <button type="submit" aria-busy={saving} disabled={saving}>
                Submit
              </button>
            </div>
          </form>
        </p>
      </details>
    </section>
  );
}
