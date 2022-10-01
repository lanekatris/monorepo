import cheerio from 'cheerio'
import axios from 'axios';
import {uniq} from 'lodash'
const fs = require('fs');

const SOURCE_URL = 'https://www.marshallstreetdiscgolf.com/flightguide'

export async function getAllDiscsHtml(): Promise<string> {
  // throw new Error('dont call me')
  const response = await axios.get(SOURCE_URL)
  return response.data;
}

interface Disc {
  name: string
  brand: string
  category: string
  stability: string;
  fade: number
  glide: number
  speed: number
  turn: number
}

interface GetAllDiscsResponseAggregations {
  brands: string[]
  categories: string[]
  stabilities: string[]
}

interface GetAllDiscsResponse {
  discs: Disc[]
  source: string
  lastUpdated: Date
  createdBy: string
  aggregations: GetAllDiscsResponseAggregations
}

const stringFields = ['brand', 'category']
const numberFields = ['fade', 'glide', 'speed', 'turn']

export async function getAllDiscs(html?: string) : Promise<GetAllDiscsResponse> {
  const sourceHtml = html || await getAllDiscsHtml()
  const $ = cheerio.load(sourceHtml)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const discs =  $('.disc-item').map((i, el) => {
    const $el = $(el);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const obj: Disc = {};
    for (const key of stringFields){
      obj[key] = $el.attr(`data-${key}`)
    }

    for (const key of numberFields){
      obj[key] = Number($el.attr(`data-${key}`))
    }

    obj.name = $el.children().first().text()
    obj.stability = $el.parent().parent().parent().children().first().children().first().text();

    return obj
  }).toArray()

  return {
    discs,
    source: SOURCE_URL,
    lastUpdated: new Date(),
    createdBy: 'Lane Katris (lanekatris@gmail.com)',
    aggregations: {
      // brands: uniqBy(discs, x => x.brand)
      brands: uniq(discs.map(({brand}) => brand)),
      categories: uniq(discs.map(({category}) => category)),
      stabilities: uniq(discs.map(({stability}) => stability))
    }
  }
}
