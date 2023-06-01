import { Box, Typography } from "@mui/material";
import React from "react";
import { FitnessHistory } from "./fitness-history";
import { GoalList } from "./goal-list";
import { GetGoalLogsResult, Goal } from "../gql/generated";
// interface Goal {
//   group: "Fitness";
//   frequency: "Daily" | "Weekly";
//   description: string;
//   completed: boolean;
//   targetCount: number;
//   tags?: string[];
// }

// Capture per week
// todo: jot down the start week
// although, as goals are added/removed, use that date for the goals at that time for evaluation
// const goals: Goal[] = [
//   {
//     group: "Fitness",
//     frequency: "Daily",
//     description: "Stretch",
//     targetCount: 1,
//     completed: true,
//   },
//   {
//     group: "Fitness",
//     frequency: "Weekly",
//     description: "Cardio",
//     targetCount: 1,
//     completed: true,
//   },
//   {
//     group: "Fitness",
//     frequency: "Weekly",
//     description: "Climb",
//     targetCount: 2,
//     completed: false,
//   },
//   {
//     group: "Fitness",
//     frequency: "Weekly",
//     description: "Squats",
//     targetCount: 1,
//     completed: false,
//     tags: ["Snowboarding"],
//   },
//   {
//     group: "Fitness",
//     frequency: "Weekly",
//     description: "Core to help my back",
//     targetCount: 2,
//     completed: false,
//     tags: ["Injury"],
//   },
// ];
// const completedGoals = goals.filter((x) => x.completed).length;

export default function FitnessGoals({
  goals,
  goalLog,
}: {
  goals: Goal[];
  goalLog: GetGoalLogsResult;
}) {
  return (
    <>
      <Typography variant="h6">Fitness Goals</Typography>

      <Typography variant="caption">
        For me to keep my fitness goals I need to publicly hold myself
        accountable. This shows how I'm doing.
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Current Goals</Typography>
        <GoalList goals={goals} />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">
          Fitness History (Started 2023-01-22)
        </Typography>
        <FitnessHistory goalLog={goalLog} />
      </Box>
    </>
  );
}
