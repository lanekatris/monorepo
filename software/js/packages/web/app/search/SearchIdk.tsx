'use client';

import Fuse, { FuseIndexRecords } from 'fuse.js';

import { useEffect, useMemo, useState } from 'react';
import {
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

export default function SearchIdk({ data, index }: SearchIdkProps) {
  // console.log('fuse', data, indexJson);

  // useEffect(() => {
  //
  // }, []);

  const [results, setResults] = useState<SearchResult[]>([]);

  const fuse = useMemo(() => {
    return new Fuse(data, { keys: ['name', 'source'] }, Fuse.parseIndex(index));
  }, [data, index]);

  useEffect(() => {
    if (!fuse) return;
    // console.log('fuse is ready');
    const a = fuse.search(' ', { limit: 20 });
    console.log(a);
    setResults(a.map((x) => x.item));
  }, [fuse]);

  return (
    <>
      <Input
        autoFocus
        size="lg"
        placeholder="Search"
        type="search"
        onChange={(e) => {
          console.log(e.target.value);

          console.log(fuse.search(e.target.value));
          setResults(
            fuse.search(e.target.value || '', { limit: 20 }).map((x) => x.item)
          );
        }}
      />
      {/*<pre>{JSON.stringify(results, null, 2)}</pre>*/}
      <br />
      <Stack direction="row" spacing={1}>
        <Typography level="body-lg">Results</Typography>
        <Chip size={'sm'}>
          {results.length}/{data.length} Total
        </Chip>
      </Stack>
      <List>
        {results.map((x) => (
          <>
            <ListDivider />
            <ListItem key={x.name}>
              <ListItemContent>
                {/*{x.url ? (*/}
                {/*  <Link href={x.url} target={'_blank'}>*/}
                {/*    {x.name}*/}
                {/*  </Link>*/}
                {/*) : (*/}
                {/*  x.name*/}
                {/*)}*/}
                <Typography level="title-sm">{x.name}</Typography>
                <Stack direction={'row'} spacing={1}>
                  <Chip size={'sm'} variant={'outlined'}>
                    {x.source}
                  </Chip>
                  {x.url ? (
                    <Link href={x.url} target={'_blank'}>
                      <Chip
                        // sx={{ ml: 1 }}
                        size={'sm'}
                        variant={'outlined'}
                        color={'primary'}
                        // endDecorator={null}
                      >
                        Link
                      </Chip>
                    </Link>
                  ) : null}
                </Stack>
              </ListItemContent>
            </ListItem>
          </>
        ))}
      </List>
    </>
  );
}
