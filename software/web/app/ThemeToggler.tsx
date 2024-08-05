'use client';
import { Button } from '@mui/joy';
import { useColorScheme } from '@mui/joy/styles';
import { FaSun } from 'react-icons/fa';
import { FaMoon } from 'react-icons/fa';

export default function ThemeToggler() {
  const { mode, setMode } = useColorScheme();
  return (
    <Button
      variant="plain"
      // color="neutral"
      // sx={{ paddingLeft: 0 }}
      size="sm"
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
    >
      {mode === 'dark' ? <FaSun /> : <FaMoon />}
    </Button>
  );
}
