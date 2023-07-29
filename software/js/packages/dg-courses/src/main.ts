import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Course } from './entity/course';
import { Html } from './entity/html';
import { STATE } from './state';
import { CoursesByState } from './courses-by-state';
import axios from 'axios';
import { CacheItem } from './entity/cache-item';
import { differenceInSeconds } from 'date-fns';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'dg.db',
  entities: [Course, Html, CacheItem],
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

  console.log(`Done processing ${state}, found ${result.length} courses`);

  try {
    await connection.manager.save(result);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function loadCoursesIntoDb() {
  // const states = [STATE.WestVirginia, STATE.Ohio];
  const states = Object.values(STATE);
  let i = 1;
  for (const state of states) {
    console.log(`Processing state ${state} (${i}/${states.length})...`);
    await getCoursesByStateAndPersist(state, AppDataSource);
    i++;
  }
}

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = '0' + num;
  return num;
}

async function loaIndividualCourseData() {
  const courses = await AppDataSource.getRepository(Course).find();
  console.log(
    `Found ${courses.length} courses to load individual course data for`
  );

  let i = 1;
  for (const course of courses) {
    console.log(
      `Processing course ${pad(i, 4)}/${courses.length} ${course.name}...`
    );

    const url = `https://www.pdga.com/course-directory/course/${course.id}`;
    // exist in cache?
    const cacheRepo = AppDataSource.getRepository(CacheItem);
    const cacheItem = await cacheRepo.findOne({ where: { url } });

    if (cacheItem) {
      // good to go, parse data
      console.log(`Cache exists for ${course.id}`);
    } else {
      console.log(`Getting course detail ${course.id}`);

      const { data } = await axios.get(url);
      const newCacheItem = new CacheItem();
      newCacheItem.url = url;
      newCacheItem.html = data;
      await AppDataSource.manager.save(newCacheItem);
    }

    // Get the html
    i++;
  }
}

AppDataSource.initialize().then(async () => {
  const start = new Date();
  // todo: bring this back
  // await loadCoursesIntoDb();
  await loaIndividualCourseData();

  const end = new Date();
  console.log(`Completed in ${differenceInSeconds(end, start)} seconds`);
});

// Make a call to grid page on pdga.com, is there anything we haven't loaded?
// No - we are done
// Yes - create course header record for the missing
// Iterate through all header records that have missing detail and load missing detail
// Create csv
// Create sqlite
