import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import schema from '../../schema/schema.json';
import { nanoid } from 'nanoid';
import { GetGeneralEvents } from './get-general-events';

export class GetEventsModelQuery {}
const uiSchema = {
  // eventName: { 'ui:widget': 'hidden' },
  // id: { 'ui:widget': 'hidden' },
};

@QueryHandler(GetEventsModelQuery)
export class GetEventsModelHandler
  implements IQueryHandler<GetEventsModelQuery>
{
  constructor(private generalEvents: GetGeneralEvents) {}
  async execute(query: GetEventsModelQuery): Promise<any> {
    const generalEvents = await this.generalEvents.get();

    return {
      schema: JSON.stringify(schema),
      uiSchema: JSON.stringify(uiSchema),
      formData: JSON.stringify({
        id: nanoid(),
        date: format(new Date(), 'yyyy-LL-dd'),
      }),
      calendarEvents: JSON.stringify(
        generalEvents.map((e) => {
          const formatted = {
            id: e.id,
            title: `${e.activities} ${e.name}`,
            start: e.date,
            color: 'blue',
            textColor: 'white',
          };

          if (e.activities?.length === 0) {
            formatted.color = 'yellow';
            formatted.textColor = 'black';
          }

          return formatted;
        }),
      ),
    };
  }
}
