import DatePicker from 'react-datepicker';
import { Box } from '@mui/joy';
import React, { useState } from 'react';

export default function SimpleCalendar() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  return (
    <Box textAlign="center">
      <DatePicker
        // inputStyle={{ textAlign: 'center' }}
        selected={startDate}
        onChange={() => {}}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
      />
    </Box>
  );
}
