'use client';
import DatePicker from 'react-datepicker';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

interface ThisMonthActivitiesCalendarProps {
  dates?: Date[];
}

export default function ThisMonthActivitiesCalendar({
  dates,
}: ThisMonthActivitiesCalendarProps) {
  return (
    <DatePicker
      selectedDates={dates}
      selectsMultiple
      onChange={() => {}}
      inline
    />
  );
}
