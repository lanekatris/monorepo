
import { Parser } from '@json2csv/plainjs';
import fs from 'fs'
// import glob from 'glob'
// const glob = require('glob')
import {glob} from 'glob'
import { EOL } from "os";

// interface PlaceVisit {
//
// }

export interface GooglePlaceVisit {
    placeVisit: PlaceVisit;
}

export interface PlaceVisit {
    location:                Location;
    duration:                Duration;
    placeConfidence:         string;
    centerLatE7:             number;
    centerLngE7:             number;
    visitConfidence:         number;
    otherCandidateLocations: Location[];
    editConfirmationStatus:  string;
    simplifiedRawPath:       SimplifiedRawPath;
    locationConfidence:      number;
    placeVisitType:          string;
    placeVisitImportance:    string;
}

export interface Duration {
    startTimestamp: Date;
    endTimestamp:   Date;
}

export interface Location {
    latitudeE7:            number;
    longitudeE7:           number;
    placeId:               string;
    address:               string;
    name?:                 string;
    sourceInfo?:           SourceInfo;
    locationConfidence:    number;
    calibratedProbability: number;
}

export interface SourceInfo {
    deviceTag: number;
}

export interface SimplifiedRawPath {
    points:         Point[];
    source:         string;
    distanceMeters: number;
}

export interface Point {
    latE7:          number;
    lngE7:          number;
    accuracyMeters: number;
    timestamp:      Date;
}


interface RawTimelineObject {
    activitySegment: string[]
    placeVisit: PlaceVisit
}

const excludes = [
 'ChIJM-Y7rIPvSIgRmkbOQqSox04', // home
    'ChIJx-_-2O1MSIgRsHgYgSG6Qwg', //pburg home
    'ChIJ-2HtjnvMSYgRbKyvdOQR2t0', // mmh
    'ChIJtR8yHHzmSIgRD9wUH6LQO4E', //dads
    'ChIJGfrY-dEsT4gRTvr1DLT6y6M', //chase building job
    // 'ChIJyaFUxe1MSIgR3u5tw8qvOCw', //pburg neighbor house
    // 'ChIJI01kknxLRogRvWpOw3RnU8Q', //jackson oh house
    // 'ChIJjePbaFnhSIgRwtdE1ETFTXU', //wife parents
    // 'ChIJ06EuiQrhpIkRd3t78usjWvw', //honeymoon outer banks
    // 'ChIJ4dnGoILvSIgRtcL647CxjIQ', //on my street


    'McDonald\'s',


    'Buffalo Wild Wings',
    'Tim Hortons',
    'Kroger',
    'Las Trancas Mexican Restaurant - Ripley',
    'Subway',
    'Tractor Supply Co.',
        'Isaacs Run',
    'Marathon gas Station',
    'Nick\'s Restaurant',
    'Waffle House',


    'Wings Etc.',
        'The Grind',
    'Chick-fil-A',
    'Circle K',
    'Pirates Landing',
    'Outback Steakhouse',
    'Jackson General Hospital',
    'Gino\'s Pizza & Spaghetti House',
    'Chick-fil-A',
    '7-Eleven',
    'Jim \'N Nick\'s Bar-B-Q',
    'Zaxby\'s Chicken Fingers & Buffalo Wings',
    'Chipotle Mexican Grill',
    'Circle K',
    'Cheddar\'s Scratch Kitchen',
    'Speedway',
    'Tudor\'s Biscuit World',
    'Cheddar\'s Scratch Kitchen',
    'Anytime Fitness',
    'Wings Etc.',
        'Chick-fil-A',
    'Pippa\'s Cafe',
    'Dollar Tree',
    'Taco Bell',
    'Fairplain Yacht Club',
    'Family Tree Dental - Colegate',
    'United States Postal Service',
    'Maka Mia Pizza Subs and Pub',
    'QDOBA Mexican Eats',
    'Fairplain Yacht Club',
    'City of Ripley',
    'Truist',
    'Samurai Hibachi & Sushi',
    'Walmart Supercenter',
    'Chase Bank',
    'Applebee\'s Grill + Bar',
    'Burger King',
    'Grand Central Mall',
    'Frontier Shopping Center',
    'Jumbo Buffet Grill',
    'Burger King',

    'Lafayette Center',
    'Sheetz',
    'Qdoba',
    'Exxon',
    'Wendy\'s',
    'Sheetz #584',
'Southridge Shopping Center',
'Arby\'s',
'Marietta Memorial Hospital',
'Lowe\'s Home Improvement',
'Dairy Queen',
'Bob Evans',
'21 Country Market',
'Penn Station East Coast Subs',
'Love\'s Travel Stop',
'El Mariachi Restaurant',
'Downtown Charleston Historic District',
'Advance Auto Parts',
'Hardman\'s',
'Go Mart Inc',
'China Buffet',
'Ponderosa',
'Marietta Brewing Company',
'AutoZone Auto Parts',
'Sam\'s Club',
'Marietta Adventure Company',
'Marathon Gas',
'Full & Hupp',
'White Castle',
'The Shops at Kanawha',
'Texas Roadhouse',
'Little Caesars Pizza',
'Boat House of Marietta (Boathouse BBQ)',
'BP',
'Shell',
'First Baptist Church Of Williamstown',
'East Muskingum Park',
'Dollar General',
'Applebee’s Grill + Bar',
'The Boathouse',
'Starbucks',
'Burger Carte Foods',
'The Home Depot',



]


let headerAdded = true
function step1(filePath: string) {

// load json file
// const raw =  fs.readFileSync('/home/lane/git/monorepo/software/google-location-parser/Takeout/Location History/Semantic Location History/2023/2023_JANUARY.json')
    const raw = require(filePath) as {
        timelineObjects: RawTimelineObject[]
    }

    // console.log(`${raw.timelineObjects.length} total timeline objects`)

    const visits = raw.timelineObjects
        .filter(x => x.placeVisit)
        .filter(x => !excludes.includes(x.placeVisit.location.placeId))
        .filter(x => !excludes.includes(x.placeVisit.location.name!))

    // console.log(`${visits.length} place visits`)

    if (!visits.length) {
        // if (header) console.warn('what the heck', filePath)
        return ''
    }


    const parser = new Parser({header: headerAdded})
    const csv = parser.parse(visits.map(x =>({
        placeId: x.placeVisit.location.placeId,
        confidence: x.placeVisit.placeConfidence,
        name: x.placeVisit.location.name,
        address: x.placeVisit.location.address,
        lat: x.placeVisit.location.latitudeE7,
        long: x.placeVisit.location.longitudeE7,
        durationStart: x.placeVisit.duration.startTimestamp,
        durationEnd: x.placeVisit.duration.endTimestamp,
    })))

    if (headerAdded){
        // console.log('added header', csv)
        headerAdded = false
    }

// parse json
//     console.log(csv)

    return csv;
    // fs.writeFileSync('visits.csv', csv)
}

async function step2() {
    let wholeFile = ''

    const files = await glob('/home/lane/git/monorepo/software/google-location-parser/Takeout/Location History/Semantic Location History/**/*.json')
    files.reverse()

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const newData = step1(file)
        if (i == 0 && newData.length) {
            wholeFile = newData
        } else if (newData.length) {
            wholeFile += EOL + newData
        }
        // wholeFile += newData
    }

    // files.forEach(file => {
    //     const newData = step1(file)
    //     wholeFile += newData
    // })

    fs.writeFileSync('visits.csv', wholeFile)
    // console.log('files', files)
    console.log('file written')
}

step2()

//'/home/lane/git/monorepo/software/google-location-parser/Takeout/Location History/Semantic Location History/2023/2023_JANUARY.json'


//8072 rows

// 6657 after removing my home