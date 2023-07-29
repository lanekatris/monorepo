import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Course } from './entity/course';
import { Html } from './entity/html';
import { STATE } from './state';
import { CoursesByState } from './courses-by-state';

// export function createDbConnection() {
//   // return typeOrmConnection({
//   //   type: 'sqlite',
//   //   database: 'dg.db',
//   //   entities: [Course, Html],
//   //   synchronize: true,
//   //   logging: false,
//   // });
//
//   return new DataSource({
//     type: 'sqlite',
//     database: 'dg.db',
//     entities: [Course, Html],
//     synchronize: true,
//     logging: false,
//   });
// }

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'dg.db',
  entities: [Course, Html],
  synchronize: true,
  logging: false,
});

async function getCoursesByStateAndPersist(
  state: STATE,
  connection: DataSource
) {
  const query = new CoursesByState({
    state,
    htmlRepo: connection.getRepository(Html),
  });
  const result = await query.getCourses();

  console.log('found these result', {
    count: result.length,
    state,
  });

  try {
    await connection.manager.save(result);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function loadCoursesIntoDb() {
  const states = [STATE.WestVirginia, STATE.Ohio];
  // const connection = await createDbConnection();
  for (const state of states) {
    await getCoursesByStateAndPersist(state, AppDataSource);
  }
}

AppDataSource.initialize().then(async () => {
  await loadCoursesIntoDb();
});

// loadCoursesIntoDb();
// (async () => {
//   await loadCoursesIntoDb();
// })();
//
// const states = ['WV'];
// const connection = await createDbConnection();

// Make a call to grid page on pdga.com, is there anything we haven't loaded?
// No - we are done
// Yes - create course header record for the missing
// Iterate through all header records that have missing detail and load missing detail
// Create csv
// Create sqlite
