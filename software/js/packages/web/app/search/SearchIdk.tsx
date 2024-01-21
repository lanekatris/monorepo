'use client';

import Fuse, { Expression, FuseIndexRecords, FuseSearchOptions } from 'fuse.js';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Checkbox,
  Chip,
  Input,
  Link,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  Stack,
  Typography,
} from '@mui/joy';
import { SearchResult } from 'packages/web/app/search/page';

interface SearchIdkProps {
  data: SearchResult[];
  index: { keys: readonly string[]; records: FuseIndexRecords };
}

const fuseSerchOptions: FuseSearchOptions = {
  limit: 20,
  // threshold: 0.4,
};

export default function SearchIdk({ data, index }: SearchIdkProps) {
  // const [results, setResults] = useState<SearchResult[]>([]);
  // const [entityFilters, setEntityFilters] = useState<string[]>([]);

  const [e, setE] = useState({
    query: '',
    includeBookmarks: true,
    includePodcasts: true,
    fuse: new Fuse(
      data,
      { keys: ['name', 'source'], threshold: 0.4 },
      Fuse.parseIndex(index)
    ),
  });

  const { includeBookmarks, includePodcasts, fuse, query } = e;

  // const fuse = useMemo(() => {
  //   return new Fuse(
  //     data,
  //     { keys: ['name', 'source'], threshold: 0.4 },
  //     Fuse.parseIndex(index)
  //   );
  // }, [data, index]);

  // useEffect(() => {
  //   if (!fuse) return;
  //   // console.log('fuse is ready');
  //   const a = fuse.search(' ', fuseSerchOptions);
  //   console.log(a);
  //   setResults(a.map((x) => x.item));
  // }, [fuse]);

  const results = useMemo<SearchResult[]>(() => {
    // console.log('hit', query);
    // return fuse.search(query || ' ', {limit: 20}).map((x) => x.item);

    const entityFilters = [];

    if (includePodcasts) entityFilters.push('podcast');
    if (includeBookmarks) entityFilters.push('bookmark');

    let entityFilter = '';

    // if (!includePodcasts || !includeBookmarks) {
    // }
    if (!includeBookmarks) {
      entityFilter = 'podcast';
    }

    if (!includePodcasts) {
      entityFilter = 'bookmark';
    }

    const filters: Expression[] = [{ name: query || ' ' }];

    if (entityFilter) filters.push({ source: entityFilter });

    // if (entityFilters.length === 0) return fuse.search(query || ' ', {limit: 20}

    return fuse
      .search(
        {
          // $val: query || ' ',
          // $and: [
          //   { name: query || ' ' },
          //   // { source: 'bookmark' },
          //   // { source: 'podcast' },
          // ],
          $and: filters,
          // $or: entityFilters.map((x) => ({ source: x })),
        },
        { limit: 20 }
      )
      .map((x) => x.item);
  }, [query, fuse, includeBookmarks, includePodcasts]);

  return (
    <>
      <Input
        autoFocus
        size="lg"
        placeholder="Search"
        type="search"
        onChange={(e) => {
          console.log(e.target.value);

          // console.log(fuse.search(e.target.value));
          // setResults(
          //   fuse
          //     .search(e.target.value || '', fuseSerchOptions)
          //     .map((x) => x.item)
          // );
          setE((current) => ({ ...current, query: e.target.value }));
        }}
      />
      {/*<br />*/}
      {/*<Box textAlign={'right'} mt={1}>*/}
      <Stack
        mt={1}
        direction={'row'}
        spacing={1}
        justifyContent={'flex-end'}
        sx={{ position: 'absolute', right: 45 }}
      >
        <Checkbox
          label="Podcasts"
          checked={includePodcasts}
          onChange={(e) =>
            setE((current) => ({
              ...current,
              includePodcasts: e.target.checked,
            }))
          }
        />
        <Checkbox
          label="Bookmarks"
          checked={includeBookmarks}
          onChange={(e) =>
            setE((current) => ({
              ...current,
              includeBookmarks: e.target.checked,
            }))
          }
        />
      </Stack>
      {/*</Box>*/}
      {/*<pre>{JSON.stringify(results, null, 2)}</pre>*/}
      {/*<br />*/}
      <Stack direction="row" spacing={1} mt={1}>
        <Typography level="body-lg">Results</Typography>
        <Chip size={'sm'}>
          {results.length}/{data.length} Total
        </Chip>
      </Stack>
      <List>
        {results.map((x) => (
          <Box key={x.url}>
            <ListDivider />
            <ListItem>
              <ListItemContent>
                <Typography level="title-sm">{x.name}</Typography>
                <Stack
                  direction={'row'}
                  spacing={1}
                  justifyContent={'space-between'}
                >
                  <Chip size={'sm'} variant={'outlined'}>
                    {x.source}
                  </Chip>
                  {x.url ? (
                    <Link href={x.url} target={'_blank'}>
                      <Chip size={'sm'} variant={'plain'} color={'primary'}>
                        Link
                      </Chip>
                    </Link>
                  ) : null}
                </Stack>
              </ListItemContent>
            </ListItem>
          </Box>
        ))}
      </List>
    </>
  );
}
