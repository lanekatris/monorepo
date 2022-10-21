import { Injectable, Logger, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RhinofitModule } from './rhinofit/rhinofit.module';
import { QueryBus } from '@nestjs/cqrs';
import { GetTrackingRecordsQuery } from './rhinofit/queries/get-tracking-records.handler';
import { addDays } from 'date-fns';
import { GetReservationsQuery } from './rhinofit/queries/get-reservations.handler';

export const handler = async function (event) {
  const logger = new Logger('Handler');
  const app = await NestFactory.createApplicationContext(RhinofitModule);
  const queryBus = app.get(QueryBus);
  /**
   * https://docs.nestjs.com/recipes/cqrs
   * todo:
   *    Get tracking records, fire off event for each one
   *    Create kiosk entries, dac listener
   *    Create reservations, dac listener
   *
   */
  logger.log(`Event data: ${JSON.stringify(event)}`);
  const start = new Date();
  const records = await queryBus.execute(
    new GetTrackingRecordsQuery(start, addDays(start, 1)),
  );
  logger.log(`Tracking records found: ${records.length}`);

  const reservations = await queryBus.execute(
    new GetReservationsQuery(start, addDays(start, 1)),
  );
  console.log('reservations', reservations);
  console.log('DONE!');

  // If I do the event listener, then I'll need a workflow consolidator
  // Or don't do the event listener

  return records;
};

handler({ test: true });
