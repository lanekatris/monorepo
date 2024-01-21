'use client';
import { Button } from '@mui/joy';
import { useColorScheme } from '@mui/joy/styles';

export default function ThemeToggler() {
  const { mode, setMode } = useColorScheme();
  return (
    <Button
      variant="plain"
      // color="neutral"
      sx={{ paddingLeft: 0 }}
      size={'sm'}
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
    >
      {mode === 'dark' ? 'Turn light' : 'Turn dark'}
    </Button>
  );
}
