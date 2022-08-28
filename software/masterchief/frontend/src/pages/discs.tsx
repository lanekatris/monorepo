import { useDiscsQuery, useSetDiscStatusMutation } from '../graphql';

export default function DiscsPage() {
  const { data, loading, error } = useDiscsQuery();
  const [setStatus, { loading: saving }] = useSetDiscStatusMutation();

  console.log({ data, loading, error });
  if (error) return <div>{JSON.stringify(error)}</div>;
  if (loading)
    return (
      <a href="#" aria-busy="true">
        Loading, please wait…
      </a>
    );

  return (
    <div className="main container">
      <h4>Your Feed</h4>
      <div className="feed">
        {data?.discs?.map((disc) => (
          <div key={disc.id}>
            {disc.number} - [{disc.brand}] {disc.model} <i>{disc.status}</i>
            <nav
              style={{ display: 'inline', marginLeft: 10 }}
              className="feed-item-hidden"
            >
              <ul style={{ display: 'inline' }}>
                <li style={{ height: 40 }}>
                  <details role="list">
                    <summary aria-haspopup="listbox">Set Status</summary>
                    <ul role="listbox">
                      <li>
                        <a
                          href="#"
                          aria-busy={saving}
                          aria-disabled={saving}
                          className="inline"
                          onClick={() => {
                            setStatus({
                              variables: {
                                input: {
                                  discId: disc.id,
                                  status: 'Lost',
                                },
                              },
                            });
                          }}
                        >
                          Lost
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          aria-busy={saving}
                          aria-disabled={saving}
                          className="inline"
                          onClick={() => {
                            setStatus({
                              variables: {
                                input: {
                                  discId: disc.id,
                                  status: 'InBag',
                                },
                              },
                            });
                          }}
                        >
                          In Bag
                        </a>
                      </li>
                    </ul>
                  </details>
                </li>
              </ul>
            </nav>{' '}
            {/*<a*/}
            {/*  href="#"*/}
            {/*  aria-busy={saving}*/}
            {/*  aria-disabled={saving}*/}
            {/*  className="inline"*/}
            {/*  onClick={() => {*/}
            {/*    setStatus({*/}
            {/*      variables: {*/}
            {/*        input: {*/}
            {/*          discId: disc.id,*/}
            {/*          status: 'Lost',*/}
            {/*        },*/}
            {/*      },*/}
            {/*    });*/}
            {/*  }}*/}
            {/*>*/}
            {/*  Lost*/}
            {/*</a>*/}
            {/*<a*/}
            {/*  style={{ marginLeft: 10 }}*/}
            {/*  href="#"*/}
            {/*  aria-busy={saving}*/}
            {/*  aria-disabled={saving}*/}
            {/*  className="inline"*/}
            {/*  onClick={() => {*/}
            {/*    setStatus({*/}
            {/*      variables: {*/}
            {/*        input: {*/}
            {/*          discId: disc.id,*/}
            {/*          status: 'InBag',*/}
            {/*        },*/}
            {/*      },*/}
            {/*    });*/}
            {/*  }}*/}
            {/*>*/}
            {/*  In Bag*/}
            {/*</a>*/}
          </div>
        ))}
      </div>
    </div>
  );
}
