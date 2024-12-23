'use client';
import 'react-cmdk/dist/cmdk.css';
import CommandPalette, {
  filterItems,
  getItemIndex,
  useHandleOpenCommandPalette
} from 'react-cmdk';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Session } from 'next-auth';

interface ExampleCommandPaletteProps {
  restartWeb: () => Promise<void>;
}

const Example = ({ restartWeb }: ExampleCommandPaletteProps) => {
  const [page, setPage] = useState<'root' | 'projects'>('root');
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState('');

  useHandleOpenCommandPalette(setOpen);

  const filteredItems = filterItems(
    [
      {
        heading: 'Actions',
        id: 'home',
        items: [
          // {
          //   id: 'home',
          //   children: 'Home',
          //   icon: 'HomeIcon',
          //   href: '#'
          // },
          // {
          //   id: 'settings',
          //   children: 'Settings',
          //   icon: 'CogIcon',
          //   href: '#'
          // },
          // {
          //   id: 'projects',
          //   children: 'Projects',
          //   icon: 'RectangleStackIcon',
          //   closeOnSelect: false,
          //   onClick: () => {
          //     setPage('projects');
          //   }
          // },
          {
            id: 'kick-obsidian-adventure-sync',
            children: 'Kick Obsidian Adventures',
            icon: 'CogIcon',
            onClick: () => {
              toast.promise(
                fetch('http://server1.local:4444/obsidian-adventure-sync'),
                {
                  loading: 'Kicking...',
                  success: <b>Kicked!</b>,
                  error: <b>Failed!</b>
                }
              );
            }
          },
          {
            id: 'restart-web',
            children: 'Restart Website',
            icon: 'ArrowPathIcon',
            onClick: async () => {
              console.log('Restart Website');
              const result = await restartWeb();
              console.log('r', result);
            }
          }
        ]
      }
      // {
      //   heading: 'Other',
      //   id: 'advanced',
      //   items: [
      //     {
      //       id: 'developer-settings',
      //       children: 'Developer settings',
      //       icon: 'CodeBracketIcon',
      //       href: '#'
      //     },
      //     {
      //       id: 'privacy-policy',
      //       children: 'Privacy policy',
      //       icon: 'LifebuoyIcon',
      //       href: '#'
      //     },
      //     {
      //       id: 'log-out',
      //       children: 'Log out',
      //       icon: 'ArrowRightOnRectangleIcon',
      //       onClick: () => {
      //         alert('Logging out...');
      //       }
      //     }
      //   ]
      // }
    ],
    search
  );

  return (
    <CommandPalette
      onChangeSearch={setSearch}
      onChangeOpen={setOpen}
      search={search}
      isOpen={open}
      page={page}
    >
      <CommandPalette.Page id="root">
        {filteredItems.length ? (
          filteredItems.map((list) => (
            <CommandPalette.List key={list.id} heading={list.heading}>
              {list.items.map(({ id, ...rest }) => (
                <CommandPalette.ListItem
                  key={id}
                  index={getItemIndex(filteredItems, id)}
                  {...rest}
                />
              ))}
            </CommandPalette.List>
          ))
        ) : (
          <CommandPalette.FreeSearchAction />
        )}
      </CommandPalette.Page>

      <CommandPalette.Page id="projects">
        {/* Projects page */}
        <h1>what is supposed to happen here?</h1>
      </CommandPalette.Page>
    </CommandPalette>
  );
};

export default Example;
