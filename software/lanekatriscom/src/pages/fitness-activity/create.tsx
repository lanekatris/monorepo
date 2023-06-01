import React, { useCallback, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Layout } from "../discs";
import { Link } from "gatsby";
import { GoalList } from "../../fitness/goal-list";
import {
  useCreateFitnessActivitiesMutation,
  useCreateFitnessActivityMutation,
  useGetFitnessActivityActivityLogsQuery,
} from "../../gql/generated";
import { v4 as uuid } from "uuid";
import { navigate } from "gatsby-link";
import Calendar, { CalendarTileProperties } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./fitness-activity.css";
import addDays from "date-fns/addDays";
import { isDate, isSameDay, isValid, parseISO } from "date-fns";
import { USER_ID } from "../../constants";

// function getTileClassName({ date, view }: CalendarTileProperties) {
//   if (view !== "month") return "";
//   console.log("getTitleclassname", date);
//   return "red";
// }
function getDatesInRange(startDate: Date, endDate: Date): Date[] {
  const date = new Date(startDate.getTime());

  const dates = [];

  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

export default function CreateFitnessActivity() {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [dates, setDates] = useState<[Date, Date]>([new Date(), new Date()]);
  // const [create] = useCreateFitnessActivityMutation();
  const [create] = useCreateFitnessActivitiesMutation();

  const [startDate] = useState(addDays(new Date(), -30));
  const [endDate] = useState(addDays(new Date(), 30));
  const { data, loading, refetch } = useGetFitnessActivityActivityLogsQuery({
    variables: {
      input: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
  });

  const getTileClassName = useCallback(
    ({ date, view }: CalendarTileProperties) => {
      if (view !== "month") return null;
      if (!data?.activityLogs) return null;
      // console.log("getTitleclassname", date);
      if (data.activityLogs.find((x) => isSameDay(parseISO(x.date), date))) {
        return "goal-met";
      }
      return null;
    },
    [data?.activityLogs.length]
  );

  console.log("dates", dates);

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box p={3}>
          <Link to="/" style={{ textAlign: "center", display: "block" }}>
            Home
          </Link>
          <Typography variant="h5" align="center" gutterBottom>
            Log Goal Activity
          </Typography>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              console.log("submit", { selectedId, date: dates });

              // await create({
              //   variables: {
              //     input: {
              //       activityLogId: uuid(),
              //       date: dates.toISOString(),
              //       goalId: selectedId,
              //       userId: USER_ID,
              //     },
              //   },
              // });
              // await create({
              //   variables: {
              //     input: {
              //       activityLogId: uuid(),
              //       date: dates.toISOString(),
              //       goalId: selectedId,
              //       userId: USER_ID,
              //     },
              //   },
              // });

              const allDates = getDatesInRange(dates[0], dates[1]);
              const input = allDates.map((date) => ({
                activityLogId: uuid(),
                date,
                goalId: selectedId,
                userId: USER_ID,
              }));
              console.log("input", input);
              await create({
                variables: {
                  input,
                },
              });

              // navigate("/");
              setSelectedId(undefined);
              setDates([new Date(), new Date()]);

              await refetch();
            }}
          >
            <Typography>Choose Goal</Typography>
            <GoalList
              selectedGoalId={selectedId}
              setSelectedGoalId={setSelectedId}
            />
            <br />
            <Typography>Choose Date</Typography>

            {loading && <Typography>Loading...</Typography>}
            {!loading && (
              <Calendar
                value={dates}
                showWeekNumbers
                selectRange
                calendarType="US"
                tileClassName={getTileClassName}
                onChange={(values: Date | [Date, Date]) => {
                  // @ts-ignore
                  setDates(values);
                }}
              />
            )}
            <br />
            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="outlined"
                disabled={!selectedId || !dates || loading}
              >
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </Layout>
  );
}
