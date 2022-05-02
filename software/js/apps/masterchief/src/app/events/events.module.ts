import {Module} from "@nestjs/common";
import {EventsResolver} from "./events.resolver";
import {CqrsModule} from "@nestjs/cqrs";
import {TypeOrmModule} from "@nestjs/typeorm";

import {EventEntity} from "./event.entity";
import {GetEventsHandler} from "./get-events.query";


@Module({
  imports: [TypeOrmModule.forFeature([EventEntity]), CqrsModule],
  providers: [EventsResolver, GetEventsHandler]
})
export class EventsModule {}
