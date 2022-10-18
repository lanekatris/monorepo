import { DiscGolfCourse } from './types/course';

interface ICourseIdFinder {
  find(course: DiscGolfCourse): string;
}

export class MappedValueCourseIdFinder implements ICourseIdFinder {
  private readonly mappings = {
    AOTG: 'ravens-ridge',
    'Angry Beaver at Elon Park': 'elon-park-angry-beaver',
    'Arapahoe Basin DGC': 'arapahoe-basin-disc-golf-course',
    Bailey: 'bailey-disc-golf-course',
    'Beaver Ranch Disc Golf Course': 'beaver-ranch-conifer',
    'Beech Fork Championship 18': 'beech-fork-state-park-disc-golf-course',
    'Beech Fork Family 9': 'beech-fork-state-park-disc-golf-course',
    "Bird's Nest Disc Park": 'birds-nest-disc-park',
    'Bluebird Putting Course': 'beaver-ranch-bluebird-putting-course',
    'Buckhorn at Harris Lake County Park': 'buckhorn-harris-lake-county-park',
    'Burr Oak': 'burr-oak-state-park',
    'Casey R. Logan (OBX) DGC': 'casey-r-logan-disc-golf-course',
    'Cedar Lakes Disc Golf': 'cedar-lakes-disc-golf-course',
    'Colorado Mountain College - Glenwood':
      'colorado-mountain-college-spring-valley',
    'Dunbar City Park': 'dunbar-city-park-disc-golf-course',
    'Eagles Nest  @ Alley Park': 'eagles-nest-dgc-0',
    'Eastway Park': 'eastway-park-0', // this isn't in my csv
    'Eleanor Park DGC': 'eleanor-park',
    'Emory and Henry': 'emory-and-henry-college',
    'Fayette County Park/4H DGC': 'fayette-county-park',
    'Flat Rocks': 'flat-rocks-disc-golf-course',
    'Goose Landing': 'goose-landing-richfield-park',
    'Greenbrier State Forest': 'greenbrier-state-forest-disc-golf-course',
    'Gunnison’s Edge Disc Golf Course': 'confluence-disc-golf-course',
    'Jason Wintz Memorial DGC': 'jason-wintz-memorial-disc-golf-course',
    'Moccasin Creek': 'moccasin-creek-disc-golf-course',
    Mountaineer: 'mountaineer-disc-golf-course',
    'Mountaineer Disc Golf Course': 'mountaineer-disc-golf-course-0',
    'Nevin Park': 'nevin-park-disc-golf-course',
    'New London Tech DGC': 'new-london-tech',
    'Ohio State University DGC': 'ohio-state-university',
    'Ohio Valley University Disc Golf Course': 'ohio-valley-university',
    Olathe: 'town-olathe-disc-golf-course',
    'Paint Creek': 'paint-creek-state-park-disc-golf-course',
    'Parchment Valley Winter Lake':
      'parchment-valley-winter-lake-disc-golf-course',
    'Patriot DGC': 'patriot-disc-golf-course-triad-park',
    'Peak One': 'frisco-peninsula-rec-area',
    'Pipestem State Park': 'pipestem-state-park-disc-golf-course',
    'Plantation Ruins at Winget': 'plantation-ruins-winget',
    'Project Bad Apple DGC': 'project-bad-apple-dgc',
    'Redeemer - Blue': 'redeemer-park-disc-golf-course',
    'Redeemer - White': 'redeemer-white-course',
    'Redeemer - Yellow': 'redeemer-park-disc-golf-course',
    'Renaissance Park - Gold': 'renaissance-park',
    'Renaissance Park DGC - RenSke': 'renaissance-park-renske',
    'Riverbottom disc golf park': 'baldridge-park',
    'Rocky Mountain Village': 'easter-seals-disc-golf-course',
    'Rolling Pines': 'rolling-pines-disc-golf-course',
    'Rotary Park (Red)': 'rotary-park',
    'Rotary Park (Yellow)Indian Rock': 'indian-rock-rotary-park',
    'Sandusky Park': 'blackwater-creek',
    'Scioto Grove DGC': 'scioto-grove',
    'Seth Burton Memorial': 'seth-burton-memorial-disc-golf-course',
    'Socastee Park': 'socastee-recreation-park',
    'Sugar Hollow': 'sugar-hollow-dgc',
    'Sugaw Creek Park DGC': 'sugaw-creek-park',
    'THE Diavolo DGC @ New Hope Park': 'diavolo-new-hope-park',
    'The Big Buckeye': 'big-buckeye-broughton',
    'The Crossing Disc Golf Course': 'crossing',
    'The Mountwood Monster': 'mountwood-monster',
    'The SasQuatch': 'sasquatch-broughton-nature-and-wildlife-education-area',
    'The Scrapyard DGC': 'scrapyard-idlewild-park',
    'Valley Park': 'valley-park-dgc-0',
    'Wine Cellar': 'wine-cellar-disc-golf-course',
    'Woodchuck Ridge': 'woodchuck-ridge-disc-golf-course',
  };

  find(course: DiscGolfCourse): string {
    return this.mappings[course.name];
  }
}

export class CourseIdFinder implements ICourseIdFinder {
  constructor(private finders: ICourseIdFinder[]) {}

  find(course: DiscGolfCourse): string {
    const idk = this.finders.find((x) => x.find(course));
    return idk.find(course);
  }
}
