import { SiAdblock } from 'react-icons/si';
import NextLink from 'next/link';
import React from 'react';
import { Alert, Box, Button, Container } from '@mui/joy';

export function NotAuthorized() {
  return (
    <Container maxWidth="sm">
      <Box textAlign="center">
        <SiAdblock fontSize={'6em'} color={'rgb(125, 18, 18)'} />
      </Box>
      <br />
      <Alert
        size={'lg'}
        color={'danger'}
        endDecorator={
          <NextLink href="/api/auth/signin">
            <Button size={'sm'} color={'danger'}>
              Login
            </Button>
          </NextLink>
        }
      >
        You must be logged in to access.
      </Alert>
    </Container>
  );
}
