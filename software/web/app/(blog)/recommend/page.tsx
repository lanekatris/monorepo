// import weatherData from './weather-data.json';
import places from './places.json';
import { format, isWeekend } from 'date-fns';
import { getServerSession } from 'next-auth';
import { NotAuthorized } from '../feed/notAuthorized';
import React from 'react';
import { WeatherData } from './types';

export default async function RecommendPage() {
  const session = await getServerSession();
  if (!session) return <NotAuthorized />;

  const coordinates = Object.keys(places).map((x) => x.split(','));

  const urls = coordinates.map(
    ([lat, long]) =>
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York`
  );
  console.log(urls);

  const weatherData: WeatherData[] = await Promise.all(
    urls.map((url) => fetch(url).then((x) => x.json()))
  );

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
      <h3>Forecasts</h3>
      <a href="https://www.windy.com/-Temperature-temp">Windy.com</a> (Visual
      Forecasts)
      <table>
        <caption>
          Weekend is highlighted yellow since weekends are the best.
          <br />
          Red numbers are the highest temperature at a location for that day.
          <br />
          Source of data{' '}
          <a href="https://open-meteo.com/en/docs#latitude=38.0529&longitude=-81.104&hourly=&daily=temperature_2m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York">
            here
          </a>
          .
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
              {d.daily.temperature_2m_max.map((temp, i) => {
                const { location, temperature } = warmestPerDay[indexes[i]];
                const isWarmest =
                  d.latitude === location.latitude &&
                  d.longitude === location.longitude;
                const wknd = isWeekend(new Date(indexes[i]));

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
                    {temp}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
