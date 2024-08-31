'use client';
import { useState } from 'react';
import { Chip, IconButton, Sheet, Typography } from '@mui/joy';
import { ImFire } from 'react-icons/im';
import { RawUdiscScorecardEntry } from '../../../../scorecards/raw-udisc-scorecard-entry';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export function DiscGolfRoundRow({ x }: { x: RawUdiscScorecardEntry }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr key={x.id}>
        {/*<td>*/}
        {/*  <IconButton*/}
        {/*    aria-label="expand row"*/}
        {/*    variant="plain"*/}
        {/*    color="neutral"*/}
        {/*    size="sm"*/}
        {/*    onClick={() => setOpen(!open)}*/}
        {/*  >*/}
        {/*    /!*{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}*!/*/}
        {/*    {open ? '^' : '>'}*/}
        {/*  </IconButton>*/}
        {/*</td>*/}
        <td>{x.startdate.toLocaleDateString()}</td>
        <td>
          {x.coursename}{' '}
          {x.new_course && (
            <Chip size="sm" color="success">
              New
            </Chip>
          )}
        </td>

        <td>{x.layoutname}</td>
        <td style={{ display: 'flex', gap: 5, alignItems: 'baseline' }}>
          <div style={{ color: x['+/-'] >= 0 ? 'red' : 'green' }}>
            {x['+/-'] === 0 ? 'E' : x['+/-']} ({x.total})
          </div>
          {x.streak && <ImFire color="green" />}
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
