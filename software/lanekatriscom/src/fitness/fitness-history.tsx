import { GetGoalLogsResult, useGetGoalLogQuery } from "../gql/generated";
import {
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

function getGoalLogEntryIcon(
  isThisWeek: boolean,
  completed: boolean
): JSX.Element {
  if (isThisWeek) return <HourglassEmptyIcon />;
  return completed ? (
    <CheckCircleIcon color="success" />
  ) : (
    <CancelIcon color="error" />
  );
}
export function FitnessHistory({ goalLog }: { goalLog: GetGoalLogsResult }) {
  return (
    <>
      <List>
        {goalLog.entries.map((goalLog) => {
          const icon = getGoalLogEntryIcon(
            goalLog.isThisWeek,
            goalLog.completed
          );
          return (
            <ListItem key={goalLog.weekName} disablePadding>
              {icon}
              <ListItemText
                sx={{ ml: 1 }}
                primary={
                  <>
                    {goalLog.weekName} - {goalLog.completedGoalCount}/
                    {goalLog.goalCount} {goalLog.isThisWeek && "(This Week)"}
                  </>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
