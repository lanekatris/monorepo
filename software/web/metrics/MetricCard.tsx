import {
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/joy';
import React, { ReactNode } from 'react';

export interface Metric {
  percentage: number;
  completed: number;
  total: number;
  link?: string;
  title: string;
  children?: ReactNode;
}

export function MetricCard({
  percentage,
  completed,
  total,
  link,
  title,
  children,
}: Metric) {
  return (
    <Card variant="outlined">
      <CardContent orientation="horizontal">
        <CircularProgress
          size="lg"
          color="danger"
          determinate
          value={percentage}
        >
          <Typography>{percentage}%</Typography>
        </CircularProgress>
        <CardContent>
          <Typography level="title-lg">{title}</Typography>
          <Stack direction="row" spacing={2}>
            <Typography level="body-sm">
              {completed} / {total}
            </Typography>
            {link && (
              <Typography>
                <a href={link}>More Info</a>
              </Typography>
            )}
          </Stack>
          {children}
        </CardContent>
      </CardContent>
    </Card>
  );
}
