
import { Parser } from '@json2csv/plainjs';
import fs from 'fs'
// import glob from 'glob'
// const glob = require('glob')
import {glob} from 'glob'
// import parser from 'parse-address'
// import { EOL } from "os";
const parser = require('parse-address')
const { exec } = require("child_process");
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

    `14K Photography`,
    `18th & Stout Station`,
    `31Ocean`,
    `Adkins Branch`,
    `Adkins Family RV Center`,
    `Affordable Cremations of WV`,
    `Alliance Industries`,
    `Almost Heaven Bar & Grill`,
    `Alpine Lodge Sawmill Restaurant`,
    `Alton Marketplace`,
    `Apex Wings`,
    `Aplin Church`,
    `App Rx Pharmacy`,
    `Applebee's Neighborhood Grill & Bar`,
    `Arbuckles Cabin`,
    `Arch and Eddie's`,
    `Armory Square`,
    `Arrow Luxury Townhome #268 4 Bedroom Townhouse`,
`B&G Heating and Cooling, LLC`,
`BFS #14`,
`BFS Company`,
`BFS Foods`,
`Baked Craft Wings`,
`Barnyard BBQ`,
`Bath House`,
`Best Western Cades Cove Inn`,
`Best Western Plus Morristown Conference Center Hotel`,
`Best Western Port Columbus`,

    `Big V's Traditional Barbershop`,
    `Black Sheep | Burrito and Brews`,
    `Blackbear Crossing Townhomes`,
    `Bluestone Travel Plaza`,
    `Boardwalk Billy's Raw Bar and Ribs`,
    `Bombshells & Ales`,
    `C J's Pizzeria`,
    `C.J. Maggies`,
    `CAMC Women and Children's Hospital`,
    `Camden Clark Medical Center`,
    `Cardo's Pizza`,
    `Carter Lumber`,


    `Charleston Bicycle Center`,
    `Charleston Civic Center`,
    `Charleys Philly Steaks`,
    `Charlotte Douglas International Airport`,
    `Cheba Hut "Toasted" Subs`,
    `Circleville Plaza`,
    `Citgo Diesel`,
    `Classic Diner`,
    `"Cole's Tire & Supply, Inc."`,
    `Collier Town Square`,
    `Colony Square Mall`,
    `Corduroy Inn`,
    `Cornerstone Baptist Church`,
    `Courtyard by Marriott Charlotte Northlake`,
    `Courtyard by Marriott Virginia Beach Oceanfront/North 37th Street`,
    `Cozumel Mexican Restaurant`,
    `Cozumel Méxican Restaurant | Corridor G`,
    `Crepes A La Cart`,
    `D.P. Dough`,
    `DICK'S Sporting Goods`,
    `DMV Regional Office`,
    `DQ Grill & Chill Restaurant`,
    `Da Vinci's`,
    `Dairy Queen Brazier`,
    `Dairy Queen Grill & Chill`,
    `Dairy Queen Store`,
    `Dave's Auto Supply`,
    `Deer Timothy R MD`,
    `Deja Vu Showgirls Las Vegas Strip Club`,





    `Denny's Blue Angel`,
    `Denver International Airport`,
    `Dillon Ridge Shopping Center`,
    `Dinsmore Inc.`,
        `Division of Motor Vehicles`,
    `Dixie Burger`,
    `DoubleTree by Hilton Hotel Irvine - Spectrum`,
    `Downtown Santa Monica`,
    `Downtowner Restaurant`,
    `Duckworth's Grill & Taphouse`,
    `Dunes Village Resort`,
    `Dunkin' Donuts`,
    `EXXON 77`,
    `"Eagle Fireworks, Inc."`,
    `Easton Gateway`,
    `Easton Town Center`,
    `Econo Lodge`,
    `Elk River Bar & Grill`,
    `Empire Buffet`,
    `Encompass Health Rehabilitation Hospital of Parkersburg`,
    `Express Oil LLC`,
    `Fairfield Inn & Suites by Marriott Charlotte University Research Park`,
    `Faithful & Free, LLC.`,
    `Fat Albert's Pizza`,
    `Fat Patty's Teay's Valley`,
    `FedEx Ship Center`,
    `FireSide Grille`,
    `Firehouse Subs`,
    `Firehouse Subs Charles Pointe`,
    `First Settlement Orthopaedics`,
    `Fusion Japanese Steak House`,
    `GameStop`,
    `Gihon Village Shopping Center`,
    `Glotfelty Tire Center Parkersburg`,
    `Go-Mart`,
    `Go-Mart, Inc.`,
    `GoMart`,
    `Golden Corral`,
    `Goodwill`,
    `Gran Ranchero`,
    `Grand Central Plaza`,
    `HSB Mart`,
    `Habitat For Humanity Restore`,
    `Hazy Hollow Vapors`,
    `Heart Of Gold Diner`,
    `Hibachi Express`,
    `Hickory Grove 339`,
    `Hillbilly Hot Dogs`,
    `Hocking Hills Diner`,





    `Zephyr Mountain Lodge`,
    `Your Family Restaurant`,
    `Youghiogheny Overlook Welcome Center`,
    `YMCA Paul Cline Memorial Youth Sports Complex`,
    `Wright Brothers National Memorial`,
    `Work in Progress`,
    `Wirt County Middle School`,
    `Winn-Dixie`,
    `Wings Etc. - Delivery & Curbside Available`,
    `Wings Beachwear`,
    `West Virginia University`,
    `West Virginia Tourist Information Center`,
    `West Virginia State Wildlife Center`,
    `West Virginia Market Place`,
    `West Virginia Interstate Fairground`,
    `West Town Market`,
    `Watusi Cafe`,
    `Virginia Welcome Center`,
    `Village Square`,
    `Village Parking Garage`,
    `Vienna Shopping Center`,
    `Victory Church`,
    `Travelodge by Wyndham Yampa`,
    `Town Center`,





    `The Waterfront Shops`,
    `The Village Center`,
    `The Venetian`,
    `The Shops at Crystals`,
    `The Mighty Meeple`,
    `The Linq Hotel & Casino`,
    `The Juice Box Hurricane`,
    `The Highway Diner`,
    `The Cosmopolitan of Las Vegas`,
    `The Christie Lodge`,
    `The Castle Historic House Museum`,
    `The Backwoods Bar & Grill`,
    `The Ark Church of Belpre`,
    `Thatcher Barbecue Company`,
    `Thai Lagoon Bistro`,
    `Tennessee Welcome Center`,
    `Teays Valley Church of God`,
    `Tanger Outlets Hilton Head`,
    `Tampico Mexican Restaurant`,
    `TA Truck Service`,
    `TA Travel Center`,
    `Subway Restaurants`,
    `State Employees’ Credit Union`,
`SpringHill Suites by Marriott Williamsburg`,
`SpringHill Suites by Marriott Charlotte Lake Norman/Mooresville`,
`Spaces - Irvine - Intersect Irvine`,
`Spaces - California, Irvine - Spaces - Intersect Irvine`,
`Southridge Center`,
`Smitty's Pizza`,
`Sixty Seven Pizza Co.`,
    `Sand Canyon Plaza`,
`Saint Francis Hospital`,
`Safeway`,
`SV Customs`,
`SMacNally's Bar & Grill`,
`Route 66 Restaurant`,
`Riverwalk Plaza`,
`Rite Aid`,
`Ripley Church of the Nazarene`,
`Rest Area`,
`Red Roof Inn Pittsburgh North - Cranberry Township`,
`Ravenswood Federal CU`,
`"Raven's Roost ATV Club, LLC"`,
`Rally's`,
`Quality Suites Convention Center`,
`Quality Inn`,
`Powder Monkey Townhomes`,
`Polaris Towne Center`,
`Polaris Fashion Place`,
`Pocahontas IGA`,
`Pioneer Honda`,
`Pink's Hot Dogs`,
`Pike Street Car Wash`,
`Pigman's Bar-B-Que`,
`"Piggly Wiggly (Elizabeth, WV)"`,
`Pies & Pints - Fayetteville, WV`,
`Phillips Elementary School`,
`Phat Daddy's on The Tracks`,
`Parkersburg South High School`,
`Par Mar Stores`,
`One Stop`,
`One Hot Mama's American Grille`,
`Once Upon A Child`,
`Olympic Family Restaurant`,
`Olentangy Plaza`,




    `ONE STOP #522`,
`OK Chinese Buffet`,
`Noto Michael DPM`,
`North End Tavern & Brewery`,
`No Name Bar`,
`Nitro Marketplace`,
`Nepal Restaurant`,
`National Travel`,
`National House of Pancakes`,
`Napoli's`,
`Mountain River Physical Therapy`,
`Mountain Pie Company`,
`Mound Cemetery`,
`Mother Earth Foods`,
`Morton Travel Plaza`,
`Morehead Rest Area`,
`Mooresville Consumer Square`,
`Moon Buffet`,
`Millstone Southern Smoked BBQ`,
`Midwood Smokehouse`,
`Mellow Mushroom Cary`,
`Mellow Mushroom`,
`Mega Bites Cafe`,
`Mediterranean Breeze Restaurant`,
`McCarran International Airport`,
`Mary B's Diner`,
`Marriott's Grande Ocean`,
`Marlinton Motor Inn`,
`Marietta Middle School`,
`Marietta Aquatic Center`,
`Mandalay Bay`,
`MGM Grand`,
`Los Olivos Marketplace | Irvine Spectrum`,
`Lola's Pizza`,
`Little Italy Pizza Inc`,
`"Lifetite Metal Products, LLC"`,
`Lester Raines Honda`,
`Las Trancas Méxican Restaurant | Ripley`,
`Las Trancas Mexican Restaurant`,
`Lance Shinn`,
`Lakeshore Learning Store`,
`Lake Norman Home Health`,
`Lafayette Hotel`,
`La Fogata Mexican Restaurant`,
`LITTLE GENERAL #4120 SISSONVILLE`,
`Kroger Square`,
`Knights Inn Wheeling`,
`Kmart`,
`Jolly Roger Restaurant & Pirate Bar`,
`Jackie Boys Grill & Tap`,
`Jack in the Box`,
`J & M's Used Book Store`,
`Irvine Station`,
`IKEA`,
`I-64 Eastbound Rest Area`,
`Husson's Pizza - Sissonville`,
`Hoot's Bar And Grill`,
`Holiday Inn Santa Ana-Orange Co. Arpt`,
`Holiday Inn Express & Suites Lewisburg`,
`"Holiday Inn Express & Suites Charleston-Southridge, an IHG Hotel"`,
`Holiday Inn Columbus N - I-270 Worthington`,
`Holiday Inn`,
`Harrah's Las Vegas Hotel & Casino`,
`Hardee's Red Burrito`,
`Frisco Bay`,
`Fricker's`,
`Fremont Street Experience`,
`Fox's Pizza`,
`Food Dudes Kitchen`,

    `Utah Junction Parking Area`,
    `Union Station`,
    `US Social Security Administration`,
    `Twin Creeks Public Parking`,
    `Townsend IGA`,
    `TopSpot Country Cookin' & Catering`,
    `Top of the World Rentals`,
    `Time Saver Auto Title & Notary`,
    `The Square`,
    `Super 8 by Wyndham Lewisburg`,
    `Sunset Memory Gardens Cemetery`,



    `Sugar Crossing Convenience Store`,
    `Shoppes of Burlington`,
    `Scots Landscape Nursery`,
    `Ripley field`,
    `Ripley Senior Citizen Center`,
    `Ripley Recycling Center`,
    `Ripley Paws Veterinary Clinic`,
    `Ripley High School Annex`,
    `Ripley High School`,
    `Ridgewood Condos`,
    `Quarrier St & Elizabeth St`,
    `Professional Radiator & AC Services`,
    `Planet Hollywood Resort & Casino`,
    `Pirates beachwear`,
    `Pirates Beachwear`,
    `Perth Mini Mart/ Perth bait Tackle`,
    `Pepe Osaka's Fishtaco Tequila Bar & Grill`,
    `Peoples Bank - Marietta 2nd Street Branch`,
    `Peoples Bank`,
    `Park-N-Ride`,
    `Park and Ride at Fort Hill Drive`,
    `Park Shopping Center`,
    `Morgantown Marriott at Waterfront Place`,
    `Microtel Inn & Suites By Wyndham Mineral Wells/Parkersburg`,
    `Mi Casa Fresh Market`,


    `Mac's Speed Shop`,
    `M&Z Boutique Ripley`,
    `Lovin Life Stables`,
    `Los Agaves`,
    `Little Richards Smokehouse BBQ`,
    `Little General`,
    `Lifetite Metal Products, LLC`,
    `Jason's Deli`,
    `"Grandpa Joe's Candy Shop - Chillicothe, OH"`,
    `Grand Bazaar Shops`,
    `Grace Community Church of the Nazarene`,
    `GetGo Gas Station`,
    `Flying J Travel Center`,
    `Elizabeth Way Apartments`,
    `"Eagle Fireworks, Inc."`,
    `Duke Of Suds Car Wash`,
    `Dudley Farms Plaza`,
    `Dr. Karl A. Ohly, Do`,
    `Department of Motor Vehicles`,
    `Deno's Mountain Bistro`,
    `City National Bank - North Church Branch`,
    `Chilli Peppers Coastal Grill`,
    `Chili's Grill & Bar`,
    `Chicho's`,
    `Chetty's Pub`,


    `Rocky Gap Safety Rest Area/Welcome Center`,
    `Rocas`,
    `Robins Nest Family Restaurant`,
    `Riverside Villiage Shopping Center`,
    `River's Edge Cafe`,
    `Ripley Storage Solution`,
    `Rio De Grill Brazilian Steakhouse`,
    `Reilley's Grill & Bar`,
    `Ohio State University Hospital East`,
    `La Cima Mall`,
    `La Ceiba Bar & Grill`,



    `Jerry's Restaurant & Lounge`,
    `Jackson Medical Center`,
    `Jackson County Solid Waste Authority (Recycling Center)`,
`Jackson County Clerk's Office`,
`Jackson Cemetery`,
`Island House Condominiums`,
`Grandpa Joe's Candy Shop - Chillicothe, OH`,
`Four Points by Sheraton Charleston`,
`Fountains of Bellagio`,
`Exotic Car Collection by Enterprise`,
`Dimit Accounting`,
`Dillon Cemetery`,
`Copper House Grill`,
`Cole's Tire & Supply, Inc.`,
`Cloud 9 Smokeshop & Disc Golf`,
`Center For Pain Relief`,


    `Captain Dick Smith Baseball Field`,
    `CVS`,
    `CHKD Thrift Store`,
    `By-Pass Plaza`,
    `Bear-Land General Store`,
    `Barefoot Bernie's Tropical Grill & Bar`,
    `Bally's Las Vegas Hotel & Casino`,
    `BFS`,
    `A Taste of Memphis`,


    `A Place At the Beach III`,
    `A Place At the Beach III`,
    `Eagle Fireworks, Inc.`,
    `TJ Chumps`,
    `Beaver Valley Shopping Center`,
    `Fresenius Kidney Care Indian Hills`,

`1st Choice Cabin Rentals`,
    `Another Round Disc Golf And Tap Room`,
    `Antlers Cafe & Bar`,
    `Apex Nature Park`,
    `ChIJ2xcg8mLMSYgRqCj1ujkbCac`,
    `LG #2030 FAYETTEVILLE`,
`LG #4090 MARMET`,
`LG #5300 BURNSVILLE`,
    `Lakeview Shopping Center`,
    `Ohio River Museum`,

    `Ripley Elementary School`,
    `Old Dad's General Store`


]

// const mappings: ActivityMap[] = [
//     {placeId: 'ChIJ8yTY12_TSIgRKN2NQBP8Kyg', activity: 'Indoor Rock Climbing'}
// ]
const discGolf = [

    `ChIJ0TsnCi1zSIgRAGAYJafWHyU`,
    `ChIJQ0I4ToQfVIgRJtbR4d984rk`,
    `ChIJk-8NPt0yT4gRwr-QJ1OasKk`,
    `ChIJ0eh4-wTKSYgR96imZWra7Lg`,
    `ChIJcU2CR_v9RYgRM6wYkLzM2tA`,
    `ChIJzxKDbErMSYgRx0PcBXSOUO0`,
    `ChIJ2_RWhjXMSYgR8mu8Fusj-hw`,
    `ChIJW7yrR3QaSYgRqJBvTh-QoFY`,
    `ChIJtxuC-E3wTogRS_849rzuakQ`,
    `ChIJs2Nxc8ygVogRonIjK0rRQBU`,
    `ChIJdXtXwudKSIgRMc0-Xe3tu5o`,
    `ChIJHXHDfbV9SogR_eL55oYy800`,
    `ChIJC-6UcALKSYgRL2YQshLXcf8`,
    'ChIJicpxKVPwTogROZc1eh4JmgQ',
    'ChIJq9XjGtW7SYgRuQGMcS16YO0',
    `ChIJrXLV9AUIRogRgq8RYNgIaA4`,
    `ChIJP4-kzA4IRogRcFcipnuqQds`,
    `ChIJ-zF4FpsJRogRfgUW9qHeEEo`,
    'ChIJawZSACDNSIgRYWy9Ew7JjAw',
    `ChIJOaElKfjlSIgRxXmh9AF5GfI`



]
const mappings: ActivityMap = {
    'ChIJ8yTY12_TSIgRKN2NQBP8Kyg': 'Indoor Rock Climbing',
    'ChIJ6Q86pPSVTogRzbf7-lmS3zE': 'Water Park',
    'ChIJXTi4a1H6MIgR3237iegzTnc': 'Concert',
    'ChIJ134-Tp--TogROVZBpDojEBg': 'Mountain Biking',
    'ChIJL4iUU01xS4gRoEncTSUh52U': 'Snowboarding',
    'ChIJwTbSBIvLSYgRULy8c2vteW8': 'Basketball',
    'ChIJkajlrhjTSIgRXSvsoEBnBQo': 'Disc Golf',
    'ChIJ85KhQ5PlSIgRlEfdfSLvwOo': 'Disc Golf',
    'ChIJ80JW9E9LSIgRO467Z9qDE44':'Tennis',
    'ChIJ_5ABFmo7UYgRpy2hPF2npUU':'Paintball',
    'ChIJb33YF_lfaocRTNu6b1mbolk':'Snowboarding',
    'ChIJe_Tv8YztSIgRMaGe-nmggc0': 'Paintball',
    'ChIJs5a1dl8tT4gRs8wDoXd6jnU': 'Disc Golf',
    'ChIJz72UWfd8NYgRVVp_-CjgBBw': 'Disc Golf',
    'ChIJ0fE3lrNeSIgRtoOUtait5Kg': 'Disc Golf',
    'ChIJIw_eaH_LSYgRifhxcFUnqWs': 'Disc Golf',
    'ChIJP7QemUUKR4gRt5ryABZp-qY': 'Disc Golf',
    'ChIJP6Rcy_v3QIgRybzj7tte_RA': 'Water Park',
    'ChIJ358FNm59NYgRxS48i_BsvjM': 'Indoor Rock Climbing',
    'ChIJVSKSIsamVogRUdBH85lRt2Q': 'Disc Golf',
    'ChIJg6zkHuvLSYgRAxzLHIraHLg': 'Volleyball',
    'ChIJTU8y3Ru8TogRFaGpSI2OP48': 'Outdoor Rock Climbing',
    'ChIJFR83roacOIgRMUkMcS0I-N4': 'Paintball',
    'ChIJk2x2czQryYARPGYH9ROqOGs': 'Kayaking',
    'ChIJeyN-c5PuSIgRWBsRCQN1iR8': 'Volleyball',
    'ChIJ4Y_04MwsT4gRfY7HcN0d_gM': 'Movie',
    'ChIJjyZmdnfvSIgRWre-CTPJ1Eg': 'Basketball',
    'ChIJTekU5jidS4gRl038sVFhJpM': 'Snowboarding',
    'ChIJvWJXy7twS4gRNBIyaYhQ2L0': 'Snowboarding',
    'ChIJnVLRrblwS4gR-C3fu8CVKo0': 'Snowboarding',
    'ChIJiY4nzvzWtIkRAKC20R7NA_E': 'Kayaking',
    'ChIJRaNyKPNMSIgRpo5DbSXrz8U': 'Volleyball',
    'ChIJaT6hdvFMSIgRR1GRykS5A5M': 'Tennis',
    'ChIJEfLRVfTlSIgR9LldztBpshA': 'Disc Golf',
    'ChIJbU_pDHLvSIgRXAJqBYEzq-A': 'Fishing',
    'ChIJbdeUQ8_jSogRkbcP9ceLZGk': 'Camping',
    'ChIJm1jY5etwS4gRPIgTetsQweo': 'Snowboarding',
    'ChIJq6qqqk53S4gRPQRKKoPAcTg': 'Snowboarding',
    'ChIJN6kJdqIkS4gRRiM_zajtyWk': 'Hiking',
    'ChIJL1ZgCaVwS4gR_tni2OnblBo': 'Snowboarding',
    'ChIJrQTAQpZwS4gRZXPgz09kS0s': 'Snowboarding',
    'ChIJjxWZC8hqSIgRPQEHq-1DsY4': 'Backpacking',
    'ChIJ9wFIipB6tYkRxwkmnaT98r0': 'Camping',
    'ChIJBwa8iRQ1_4gRmiPbgxV26CE': 'Hiking'

    // ...discGolf.map(x => )

}
discGolf.forEach(x => {
    mappings[x] = 'Disc Golf'
})

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

interface ActivityMap {
    // placeId: string
    [key: string] : string //'Indoor Rock Climbing' | 'Disc Golf'
}

function loadAndExcludeVisitsFromFile(filePath: string) : CsvLineItem[] {

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
            durationStartDate: new Date(x.placeVisit.duration.startTimestamp).toISOString().split('T')[0],
            durationEnd: x.placeVisit.duration.endTimestamp,
            durationEndDate: new Date(x.placeVisit.duration.endTimestamp).toISOString().split('T')[0],
            ...parser.parseLocation(x.placeVisit.location.address),
            activityType: mappings[x.placeVisit.location.placeId] || ''
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
        const newData = loadAndExcludeVisitsFromFile(file)
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

    exec(`sqlite3 visits.db "drop table tab1"`, () => {
        exec(`sqlite3 visits.db ".import --csv ./visits.csv tab1"`, () => {
            console.log('done loading into sqlite')
        })
    })

}

step2()

//'/home/lane/git/monorepo/software/google-location-parser/Takeout/Location History/Semantic Location History/2023/2023_JANUARY.json'


//8072 rows

// 6657 after removing my home