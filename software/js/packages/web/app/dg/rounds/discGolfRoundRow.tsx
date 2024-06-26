'use client';
import { RawUdiscScorecardEntry } from 'packages/scorecards/src/raw-udisc-scorecard-entry';
import { useState } from 'react';
import { IconButton, Sheet, Typography } from '@mui/joy';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export function DiscGolfRoundRow({ x }: { x: RawUdiscScorecardEntry }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr key={x.startdate + x.coursename}>
        <td>
          <IconButton
            aria-label="expand row"
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => setOpen(!open)}
          >
            {/*{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}*/}
            {open ? '^' : '>'}
          </IconButton>
        </td>
        <td>{x.startdate.toLocaleDateString()}</td>
        <td>{x.coursename}</td>

        <td>{x.layoutname}</td>
        <td style={{ color: x['+/-'] >= 0 ? 'red' : 'green' }}>
          {x['+/-'] === 0 ? 'E' : x['+/-']} ({x.total})
        </td>
        <td>{x.roundrating}</td>
      </tr>
      {open && (
        <tr>
          <td colSpan={6}>
            {open && (
              <Sheet variant="soft">
                <Typography>your stats</Typography>
              </Sheet>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
