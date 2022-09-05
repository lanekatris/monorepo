import {
  Disc,
  DiscStatus,
  useDiscsQuery,
  useSetDiscColorMutation,
  useSetDiscStatusMutation,
} from '../graphql';
import DiscColor from './disc-color';
import orderBy from 'lodash/orderBy';

export default function DiscsPage() {
  const { data, loading, error } = useDiscsQuery();
  const [setStatus, { loading: saving1 }] = useSetDiscStatusMutation();
  const [setColor, { loading: saving2 }] = useSetDiscColorMutation();

  const saving = saving1 || saving2;

  console.log({ data, loading, error });
  if (error) return <div>{JSON.stringify(error)}</div>;
  if (loading || !data)
    return (
      <a href="#" aria-busy="true">
        Loading, please wait…
      </a>
    );

  const dropdowns = [
    {
      name: 'Set Status',
      items: [
        {
          name: 'Lost',
          onClick(discId: string) {
            setStatus({
              variables: {
                input: {
                  discId,
                  status: DiscStatus.Lost,
                },
              },
            });
          },
        },
        {
          name: 'In Bag',
          onClick(discId: string) {
            setStatus({
              variables: {
                input: {
                  discId,
                  status: DiscStatus.InBag,
                },
              },
            });
          },
        },
      ],
    },
    {
      name: 'Set Color',

      items: orderBy(
        [
          {
            name: 'Yellow',
            onClick(discId: string) {
              setColor({
                variables: {
                  input: {
                    discId,
                    color: 'Yellow',
                  },
                },
              });
            },
          },
          {
            name: 'Green',
            onClick(discId: string) {
              setColor({
                variables: {
                  input: {
                    discId,
                    color: 'Green',
                  },
                },
              });
            },
          },
          {
            name: 'Red',
            onClick(discId: string) {
              setColor({
                variables: {
                  input: {
                    discId,
                    color: 'Red',
                  },
                },
              });
            },
          },
          {
            name: 'Orange',
            onClick(discId: string) {
              setColor({
                variables: {
                  input: {
                    discId,
                    color: 'Orange',
                  },
                },
              });
            },
          },
          {
            name: 'Clear Blue',
            onClick(discId: string) {
              setColor({
                variables: {
                  input: {
                    discId,
                    color: 'Clear Blue',
                  },
                },
              });
            },
          },
          {
            name: 'Pink',
            onClick(discId: string) {
              setColor({
                variables: {
                  input: {
                    discId,
                    color: 'Pink',
                  },
                },
              });
            },
          },
          {
            name: 'Blue',
            onClick(discId: string) {
              setColor({
                variables: {
                  input: {
                    discId,
                    color: 'Blue',
                  },
                },
              });
            },
          },
          {
            name: 'Glow',
            onClick(discId: string) {
              setColor({
                variables: {
                  input: {
                    discId,
                    color: 'Glow',
                  },
                },
              });
            },
          },
          {
            name: 'Purple',
            onClick(discId: string) {
              setColor({
                variables: {
                  input: {
                    discId,
                    color: 'Purple',
                  },
                },
              });
            },
          },
          {
            name: 'Black',
            onClick(discId: string) {
              setColor({
                variables: {
                  input: {
                    discId,
                    color: 'Black',
                  },
                },
              });
            },
          },
          {
            name: 'Grey',
            onClick(discId: string) {
              setColor({
                variables: {
                  input: {
                    discId,
                    color: 'Grey',
                  },
                },
              });
            },
          },
          {
            name: 'White',
            onClick(discId: string) {
              setColor({
                variables: {
                  input: {
                    discId,
                    color: 'White',
                  },
                },
              });
            },
          },
        ],
        (x) => x.name,
      ),
    },
  ];

  return (
    <div className="main container">
      <h2>Your Discs ({data.discs.length})</h2>
      <div className="feed">
        {data.discs.map((disc) => (
          <div key={disc.id}>
            {disc.number} - [{disc.brand}] <DiscColor color={disc.color} />{' '}
            {disc.model} <i>{disc.status}</i>
            {dropdowns.map((dropdown) => (
              <nav
                style={{ display: 'inline', marginLeft: 10 }}
                className="feed-item-hidden"
              >
                <ul style={{ display: 'inline' }}>
                  <li style={{ height: 40 }}>
                    <details role="list">
                      <summary aria-haspopup="listbox">{dropdown.name}</summary>
                      <ul role="listbox">
                        {dropdown.items.map((item) => (
                          <li key={item.name}>
                            <a
                              href="#"
                              aria-busy={saving}
                              aria-disabled={saving}
                              className="inline"
                              onClick={() => {
                                item.onClick(disc.id);
                              }}
                            >
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                </ul>
              </nav>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
