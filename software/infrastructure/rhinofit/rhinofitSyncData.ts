import {
  getTrackingRecords,
  GetTrackingRecordsQuery,
} from "./getTrackingRecords";
import { addDays } from "date-fns";
import { getReservations, GetReservationsQuery } from "./getReservations";
import { ActivityProcessorService } from "./ActivityProcessorService";

interface ApiGatewayResult {
  statusCode: number;
  body: string;
}

export async function rhinofitSyncData(): Promise<ApiGatewayResult> {
  const start = addDays(new Date(), -5);
  const end = addDays(new Date(), 1);
  const records = await getTrackingRecords(
    new GetTrackingRecordsQuery(start, end)
  );
  console.log(`Found ${records.length} records`);

  const reservations = await getReservations(
    new GetReservationsQuery(start, end)
  );
  console.log("reservations", reservations);

  const processor = new ActivityProcessorService();
  const response = processor.evaluate(records);
  console.log("to process", response);

  return {
    statusCode: 200,
    body: "success",
  };
}

// console.log(rhinofitSyncData());
// rhinofitSyncData();
