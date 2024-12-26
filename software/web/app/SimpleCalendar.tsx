'use client';
import DatePicker from 'react-datepicker';
import { Box } from '@mui/joy';
import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

export default function SimpleCalendar({ dates }: { dates: Date[] }) {
  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date());
  return (
    // <Box textAlign="center">
    <DatePicker
      // inputStyle={{ textAlign: 'center' }}
      // selected={startDate}
      // selected={dates}
      selectedDates={dates}
      selectsMultiple
      onChange={() => {}}
      // startDate={startDate}
      // endDate={endDate}
      // selectsRange
      inline
    />
    // </Box>
  );
}
