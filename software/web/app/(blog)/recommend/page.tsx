import places from './places.json';
import { format, isWeekend } from 'date-fns';
import { getServerSession } from 'next-auth';
import { NotAuthorized } from '../feed/notAuthorized';
import React from 'react';
import { WeatherData, wmoWeatherCodes, wmoWeatherEmojiMap } from './types';
import uvImage from './uv-index.png';
import Image from 'next/image';

export default async function RecommendPage() {
  const session = await getServerSession();
  if (!session) return <NotAuthorized />;

  const coordinates = Object.keys(places).map((x) => x.split(','));

  // https://api.open-meteo.com/v1/forecast?latitude=38.0529&longitude=-81.104&daily=temperature_2m_max,uv_index_max,uv_index_clear_sky_max,precipitation_probability_max,wind_speed_10m_max,wind_speed_10m_mean,precipitation_probability_mean,precipitation_hours&timezone=America%2FNew_York&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch
  const urls = coordinates.map(
    ([lat, long]) =>
      // `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York`

      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&past_days=0&daily=temperature_2m_max,uv_index_max,weather_code,uv_index_clear_sky_max,precipitation_probability_max,wind_speed_10m_max,wind_speed_10m_mean,precipitation_probability_mean,precipitation_hours&timezone=America%2FNew_York&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`
  );
  console.log(urls);

  const weatherData: WeatherData[] = await Promise.all(
    urls.map((url) => fetch(url).then((x) => x.json()))
  );

  console.log(weatherData[0]);

  const indexes = weatherData[0].daily.time;

  const warmestPerDay: {
    [index: string]: {
      temperature: number;
      location: { latitude: number; longitude: number };
    };
  } = {};

  weatherData.forEach((location) => {
    const { latitude, longitude, daily } = location;

    daily.time.forEach((date, index) => {
      const temp = daily.temperature_2m_max[index];
      if (!warmestPerDay[date] || temp > warmestPerDay[date].temperature) {
        warmestPerDay[date] = {
          temperature: temp,
          location: { latitude, longitude }
        };
      }
    });
  });

  return (
    <main>
      <h1>Adventure Recommender</h1>
      <p>
        <a href="https://withinhours.com/">Within Hours of xx</a>
      </p>
      <h3>Forecasts</h3>
      <a href="https://www.windy.com/-Temperature-temp">Windy.com</a> (Visual
      Forecasts)
      <p>
        <a href="https://weather.roessner.tech/home?cityId=j57akdytvcqw46xejgzmp4shpn79sbzz">
          Ripley weather
        </a>
      </p>
      <table>
        <caption>
          Weekend is highlighted yellow since weekends are the best.
          <br />
          Red numbers are the highest temperature at a location for that day.
          <br />
          Source of data <a href={urls[0]}>here</a>.
        </caption>
        <thead>
          <tr>
            <td></td>
            {weatherData[0].daily.time.map((t) => (
              <td
                key={t}
                // style={{
                //   fontWeight: isWeekend(new Date(t)) ? 'bold' : 'normal'
                // }}
              >
                {/*{getDayOfWeekCode(new Date(t))}*/}
                {format(new Date(t), 'EEEE')}
                <br />
                {t}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {weatherData.map((d) => (
            <tr key={`${d.latitude}-${d.longitude}`}>
              {/*@ts-ignore*/}
              <td>{places[`${d.latitude},${d.longitude}`]}</td>
              {d.daily.temperature_2m_max
                // .filter((x, i) => new Date(indexes[i]) >= new Date())
                .map((temp, i) => {
                  const { location, temperature } = warmestPerDay[indexes[i]];
                  const isWarmest =
                    d.latitude === location.latitude &&
                    d.longitude === location.longitude;
                  const wknd = isWeekend(new Date(indexes[i]));

                  const uvMax = Math.round(d.daily.uv_index_max[i]);
                  const uvClearSkyMax = Math.round(
                    d.daily.uv_index_clear_sky_max[i]
                  );

                  const rainAvg = d.daily.precipitation_probability_mean[i];
                  const rainMax = d.daily.precipitation_probability_max[i];

                  const windAvg = Math.round(d.daily.wind_speed_10m_mean[i]);
                  const windMax = Math.round(d.daily.wind_speed_10m_max[i]);

                  const code = wmoWeatherEmojiMap.get(d.daily.weather_code[i]);
                  // const code =

                  return (
                    <td
                      key={`${d.latitude}-${d.longitude}-${temp}`}
                      className={[
                        isWarmest ? 'danger' : '',
                        wknd ? 'bg-attention' : ''
                      ].join(' ')}
                      // style={{
                      //   fontWeight:
                      //       ? 'bold'
                      //       : 'normal'
                      // }}
                    >
                      <span style={{ fontSize: '1.4em' }}>{code?.emoji}</span>
                      <br />
                      <small>
                        {Math.round(temp)}°F
                        <br />
                        ☀️ {uvMax}/{uvClearSkyMax}
                        <br />☔ {rainAvg}/{rainMax}%
                        <br />
                        🌬️ {windAvg}/{windMax}mph
                      </small>
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>
      <Image
        src={uvImage}
        alt="Source: https://www.myuv.com.au/understanding-uv/"
      />
      <a href="https://www.myuv.com.au/understanding-uv/">
        Source: https://www.myuv.com.au/understanding-uv/
      </a>
    </main>
  );
}
