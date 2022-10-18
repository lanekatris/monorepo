import { useDiscRemoveMutation } from '../graphql';

export function DeleteDisc({ discId }: { discId: string }) {
  const [remove, { loading: saving, error }] = useDiscRemoveMutation();
  return (
    <>
      {error && <div>{JSON.stringify(error, null, 2)}</div>}
      <a
        aria-busy={saving}
        aria-disabled={saving}
        href="src/components/deleteDisc#"
        className="feed-item-hidden"
        style={{ marginLeft: 10 }}
        onClick={() =>
          remove({
            variables: {
              input: {
                discId,
              },
            },
          })
        }
      >
        Delete
      </a>
    </>
  );
}
