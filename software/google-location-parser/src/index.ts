
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


    `Valley Gem Sternwheeler`,
    `Flamingo Las Vegas`,
    `John Glenn Columbus International Airport`,
    `Hyatt Regency Denver at Colorado Convention Center`,
    `Charleston Town Center`,
    `Water Stone Outdoors`,
    `Belpre Plaza Shopping Center`,
    `The Original Pizza Place`,
    `"Spaces - California, Irvine - Spaces - Intersect Irvine"`,
    `Rich Oil`,
    `KFC`,
    `Jackson County Courthouse`,
    `Family Dollar`,
    `Cracker Barrel Old Country Store`,
    `CAMC Memorial Hospital`,
    `bp`,
    `UPS Customer Center`,
    `Third Street Deli & Catering`,
    `The Freefolk Brewery`,
    `The Custard Stand Webster Springs`,
    `The Colorado Convention Center`,
    `Sonic Drive-In`,
    `Ripley City Barber`,
    `Residence Inn by Marriott Charlotte Steele Creek`,
    `Logan's Roadhouse`,
    `Jackson Foot & Ankle Clinic`,
    `Hibachi Japanese Steakhouse`,
    `Hall's Tires`,
    `Five Guys`,
    `Dough Boyz Pizzeria`,
    `Walgreens`,
    `Shoney's`,
    `Roadhouse 2081`,
    `Planet Fitness`,
    `Kohl's Parkersburg`,
    `Jessica L Matheny, MD`,
    `Jackson County Library`,
    `Jackson County Junior Fair`,
    `Go Mart`,
    `Enterprise Rent-A-Car`,
    `C.J.Maggie's`,
    `United Bank`,
    `Sunoco Gas Station`,
    `Residence Inn by Marriott Charlotte Northlake`,
    `Play It Again Sports`,
    `LongHorn Steakhouse`,
    `Little General Store`,
    `"Lifetite Metal Products, LLC"`,
    `Harmar Tavern`,
    `Hardee's`,
    `H&R Block`,
    `Flying Dogs`,
    `Express Oil`,
    `Duchess`,
    `Dr. James G. Gaal, MD`,
    `Best Buy`,
    `BB&T`,
    `AT&T Store`,
    `Yokum's Grocery and Deli`,
    `Waybright Funeral Home`,
    `Waybright Car Wash`,
    `WVUP Jackson County Center`,
    `The Ski Barn`,
    `SUBWAY®Restaurants`,
`Ripley Fire Rescue`,
`Residence Inn by Marriott Charlotte Airport`,
`REI`,
`Queen Bee`,
`Pizza Hut`,
`Pilot Travel Center`,
`PetSmart`,
`Par Mar 18`,
`Papa John's Pizza`,
`Ollie's Bargain Outlet`,
`Miguels Pizza`,
`Micro Center`,
`MedExpress Urgent Care`,
`Marietta College`,
`Jimmy John's`,
`Jeweler's Touch`,
`Jackson County Assessor Office`,
`IHOP`,
`Habitat For Humanity`,
`Greyhound: Bus Stop`,
`Graceland Shopping Center`,
`Go Mart Food Store`,
`Fruth Pharmacy`,
`Einstein Bros. Bagels`,
`East Of Chicago Pizza Company`,
`Dunkin'`,
`Dough Boyz Pizzaria`,
`Donatos Pizza`,
`Domino's Pizza`,
`Cozumel Mexican Grill-Ripley`,
`Big Lots`,
`AutoZone`,
`Applebee's`,
`ALDI`,
`Woody's Restaurant`,
`White Castle Vegas`,
`West Union Bank`,
`Walmart Supercenter #2293 Evergreen`,
`Walmart Neighborhood Market`,
`Walmart`,
`Waffle Cabin @ Looking Glass / Olympia`,
`U-Haul Neighborhood Dealer`,
`The UPS Store`,
`Target`,
`TGI Fridays`,
`Suzi's Hamburgers`,
`Sunoco`,
`Stoked Coffee`,
`Steak 'n Shake`,


    `Waffle Cabin Winter Park Village`,
    `Ski Barn`,
    `Inn at Snowshoe`,
    `Firehouse Subs Grand Central Ave`,
    `River Town Grill`,
    `O'Neills`,
    `Napoli's Pizza`,
    `Black Sheep`,
    `Beckley Travel Plaza`,
    `Beckley Omelet Shoppe`,
    `Whiskey Taco`,
    `UNO Pizzeria & Grill`,
    `Tuque's Bar and Grill`,
    `The Pizza Place (NorthSide)`,
    `The Custard Stand`,
    `Sunrise Restaurant`,
    `Stray Cat Cafe`,
    `South Beach Grill`,
    `Sold Sisters Realty`,
    `Smokehouse BBQ`,
    `Shoe Show`,
    `Shoe Dept.`,
        `Sheetz #585`,
`Sheetz #467`,
`Sheetz #364`,
`Sheetz #212`,
`Sheetz #180`,
`Sheetz #175`,
`SUNOCO`,
`Rural King`,
`Ruby Tuesday`,
`Red Robin Burger Works`,
`Quiznos`,
`Quaker Steak & Lube`,
`Pure Kitchen`,
`Pure Eats`,
`Public Parking`,




]

interface CsvLineItem {
    placeId: string
    confidence: string
    name: string | undefined
    address: string
    lat: number
    long: number
    durationStart: Date
    durationEnd: Date
}
let headerAdded = true
function step1(filePath: string) : CsvLineItem[] {

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

    return visits.map(x => (
        {
            placeId: x.placeVisit.location.placeId,
            confidence: x.placeVisit.placeConfidence,
            name: x.placeVisit.location.name,
            address: x.placeVisit.location.address,
            lat: x.placeVisit.location.latitudeE7,
            long: x.placeVisit.location.longitudeE7,
            durationStart: x.placeVisit.duration.startTimestamp,
            durationEnd: x.placeVisit.duration.endTimestamp,
        }
    ))

    // if (!visits.length) {
    //     // if (header) console.warn('what the heck', filePath)
    //     return ''
    // }


    // const parser = new Parser({header: headerAdded})
    // const csv = parser.parse(visits.map(x =>({
    //     placeId: x.placeVisit.location.placeId,
    //     confidence: x.placeVisit.placeConfidence,
    //     name: x.placeVisit.location.name,
    //     address: x.placeVisit.location.address,
    //     lat: x.placeVisit.location.latitudeE7,
    //     long: x.placeVisit.location.longitudeE7,
    //     durationStart: x.placeVisit.duration.startTimestamp,
    //     durationEnd: x.placeVisit.duration.endTimestamp,
    // })))



    // if (headerAdded){
    //     // console.log('added header', csv)
    //     headerAdded = false
    // }

// parse json
//     console.log(csv)

    // return csv;
    // fs.writeFileSync('visits.csv', csv)
}

async function step2() {
    // let wholeFile = ''

    const files = await glob('/home/lane/git/monorepo/software/google-location-parser/Takeout/Location History/Semantic Location History/**/*.json')
    files.reverse()

    let lines: CsvLineItem[] = []
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const newData = step1(file)
        lines = [...lines, ...newData]
        // if (i == 0 && newData.length) {
        //     wholeFile = newData
        // } else if (newData.length) {
        //     wholeFile += EOL + newData
        // }
        // wholeFile += newData
    }

    // files.forEach(file => {
    //     const newData = step1(file)
    //     wholeFile += newData
    // })

    const parser = new Parser();
    const csv = parser.parse(lines)

    fs.writeFileSync('visits.csv', csv)
    // console.log('files', files)
    console.log('file written')
}

step2()

//'/home/lane/git/monorepo/software/google-location-parser/Takeout/Location History/Semantic Location History/2023/2023_JANUARY.json'


//8072 rows

// 6657 after removing my home