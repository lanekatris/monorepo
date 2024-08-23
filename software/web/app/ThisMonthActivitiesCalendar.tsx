'use client';
import DatePicker from 'react-datepicker';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

interface ThisMonthActivitiesCalendarProps {
  dates?: Date[];
}

export default function ThisMonthActivitiesCalendar({
  dates
}: ThisMonthActivitiesCalendarProps) {
  return (
    <DatePicker
      inline
      selectedDates={dates}
      selectsMultiple
      onMonthChange={(date) => {
        console.log('month chnged', date);
      }}
      onChange={(newDate, e) => {}}
      onSelect={(date) => {
        if (!date) return;
        window.open(
          `https://timeline.google.com/maps/timeline?hl=en&authuser=0&pli=1&rapt=AEjHL4OuTb6QVbcwylFSNprJeSNg3mIxuOaf4UriQxjFGOQJ7DpBVlJogCBrm8wEJfo6XyRrbZk30Wr0bTDKcwY6PE2znvkPptI_KfP6Lm3zYbu07fgfr78&pb=!1m2!1m1!1s${format(date, 'yyyy-MM-dd')}`,
          '_blank'
        );
      }}
    />
  );
}
