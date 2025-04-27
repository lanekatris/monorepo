export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  location_id: number;
  daily_units: DailyUnits;
  daily: Daily;
}

export interface Daily {
  time: string[];
  temperature_2m_max: number[];
  uv_index_max: number[];

  uv_index_clear_sky_max: number[];
  precipitation_probability_mean: number[];

  precipitation_probability_max: number[];

  wind_speed_10m_mean: number[];
  wind_speed_10m_max: number[];

  weather_code: number[];
}

export interface DailyUnits {
  time: string;
  temperature_2m_max: string;
}

export const wmoWeatherEmojiMap: Map<
  number,
  { description: string; emoji: string }
> = new Map([
  [0, { description: 'Clear sky', emoji: '☀️' }],
  [1, { description: 'Partly cloudy', emoji: '🌤️' }],
  [2, { description: 'Partly cloudy (scattered clouds)', emoji: '⛅' }],
  [3, { description: 'Overcast (broken clouds)', emoji: '🌥️' }],
  [4, { description: 'Overcast', emoji: '☁️' }],
  [5, { description: 'Fog or thick haze', emoji: '🌫️' }],
  [10, { description: 'Mist', emoji: '🌁' }],
  [11, { description: 'Shallow fog', emoji: '🌫️' }],
  [12, { description: 'Patches of fog', emoji: '🌫️' }],
  [18, { description: 'Squalls', emoji: '💨' }],
  [20, { description: 'Drizzle', emoji: '🌦️' }],
  [21, { description: 'Freezing drizzle', emoji: '❄️🌧️' }],
  [22, { description: 'Rain', emoji: '🌧️' }],
  [23, { description: 'Freezing rain', emoji: '❄️🌧️' }],
  [24, { description: 'Rain showers', emoji: '🌦️' }],
  [25, { description: 'Snow', emoji: '🌨️' }],
  [26, { description: 'Snow showers', emoji: '🌨️' }],
  [27, { description: 'Snow grains', emoji: '🌨️' }],
  [28, { description: 'Ice pellets', emoji: '🧊' }],
  [29, { description: 'Hail', emoji: '🌩️🧊' }],
  [30, { description: 'Thunderstorm (dry)', emoji: '🌩️' }],
  [31, { description: 'Thunderstorm with rain', emoji: '⛈️' }],
  [32, { description: 'Thunderstorm with hail', emoji: '⛈️🧊' }],
  [33, { description: 'Thunderstorm with snow', emoji: '🌩️🌨️' }],
  [40, { description: 'Reduced visibility by dust/sand', emoji: '🌪️' }],
  [41, { description: 'Blowing snow', emoji: '🌬️❄️' }],
  [42, { description: 'Drifting snow', emoji: '🌨️💨' }],
  [43, { description: 'Duststorm', emoji: '🌪️' }],
  [44, { description: 'Sandstorm', emoji: '🌪️' }],
  [45, { description: 'Severe duststorm', emoji: '🌪️🔥' }],
  [46, { description: 'Severe sandstorm', emoji: '🌪️🔥' }],
  [50, { description: 'Light drizzle', emoji: '🌦️' }],
  [51, { description: 'Moderate drizzle', emoji: '🌧️' }],
  [52, { description: 'Heavy drizzle', emoji: '🌧️' }],
  [53, { description: 'Light rain', emoji: '🌧️' }],
  [54, { description: 'Moderate rain', emoji: '🌧️' }],
  [55, { description: 'Heavy rain', emoji: '🌧️🌧️' }],
  [56, { description: 'Light snow', emoji: '🌨️' }],
  [57, { description: 'Moderate snow', emoji: '🌨️' }],
  [58, { description: 'Heavy snow', emoji: '❄️❄️' }],
  [59, { description: 'Rain and snow', emoji: '🌧️❄️' }],
  [60, { description: 'Showers, slight', emoji: '🌦️' }],
  [61, { description: 'Showers, moderate', emoji: '🌧️' }],
  [62, { description: 'Showers, heavy', emoji: '🌧️🌧️' }],
  [63, { description: 'Thunderstorm, slight', emoji: '🌩️' }],
  [64, { description: 'Thunderstorm, moderate', emoji: '⛈️' }],
  [65, { description: 'Thunderstorm, heavy', emoji: '🌩️🌩️' }],
  [66, { description: 'Thunderstorm with hail, slight', emoji: '🌩️🧊' }],
  [67, { description: 'Thunderstorm with hail, moderate', emoji: '⛈️🧊' }],
  [68, { description: 'Thunderstorm with hail, heavy', emoji: '⛈️🧊🧊' }],
  [70, { description: 'Light snow grains', emoji: '❄️' }],
  [71, { description: 'Moderate snow grains', emoji: '🌨️' }],
  [72, { description: 'Heavy snow grains', emoji: '🌨️❄️' }],
  [73, { description: 'Light ice pellets', emoji: '🧊' }],
  [74, { description: 'Moderate ice pellets', emoji: '🧊🧊' }],
  [75, { description: 'Heavy ice pellets', emoji: '🧊🧊🧊' }],
  [76, { description: 'Light hail', emoji: '🌩️🧊' }],
  [77, { description: 'Moderate hail', emoji: '⛈️🧊' }],
  [78, { description: 'Heavy hail', emoji: '⛈️🧊🧊' }],
  [79, { description: 'Thunderstorm with snow and hail', emoji: '🌩️❄️🧊' }],
  [80, { description: 'Unspecified precipitation', emoji: '🌧️❓' }],
  [81, { description: 'Rain shower, slight', emoji: '🌦️' }],
  [82, { description: 'Rain shower, moderate or heavy', emoji: '🌧️🌧️' }],
  [83, { description: 'Snow shower, slight', emoji: '🌨️' }],
  [84, { description: 'Snow shower, moderate or heavy', emoji: '❄️❄️' }],
  [85, { description: 'Hail shower, slight', emoji: '🌦️🧊' }],
  [86, { description: 'Hail shower, moderate or heavy', emoji: '🌧️🧊🧊' }],
  [87, { description: 'Drifting snow, light', emoji: '🌨️💨' }],
  [88, { description: 'Drifting snow, moderate or heavy', emoji: '🌨️💨💨' }],
  [89, { description: 'Blowing snow, light', emoji: '❄️💨' }],
  [90, { description: 'Blowing snow, moderate or heavy', emoji: '❄️💨💨' }],
  [91, { description: 'Thunderstorm, no precipitation', emoji: '🌩️' }],
  [92, { description: 'Thunderstorm, with precipitation', emoji: '⛈️' }],
  [93, { description: 'Dust or sand raised by wind', emoji: '💨🌪️' }],
  [94, { description: 'Duststorm or sandstorm in sight', emoji: '🌪️👀' }],
  [95, { description: 'Thunderstorm, slight/moderate', emoji: '🌩️' }],
  [96, { description: 'Thunderstorm with hail, slight', emoji: '🌩️🧊' }],
  [97, { description: 'Thunderstorm, heavy', emoji: '⛈️⛈️' }],
  [98, { description: 'Thunderstorm with hail, moderate', emoji: '⛈️🧊🧊' }],
  [99, { description: 'Thunderstorm with hail, heavy', emoji: '⛈️🧊🧊🧊' }]
]);

export const wmoWeatherCodes: Map<number, string> = new Map([
  [0, 'Clear sky'],
  [1, 'Partly cloudy'],
  [2, 'Partly cloudy (scattered clouds)'],
  [3, 'Overcast (broken clouds)'],
  [4, 'Overcast'],
  [5, 'Fog or thick haze'],
  [10, 'Mist'],
  [11, 'Shallow fog'],
  [12, 'Patches of fog'],
  [18, 'Squalls'],
  [20, 'Drizzle, not freezing'],
  [21, 'Drizzle, freezing'],
  [22, 'Rain, not freezing'],
  [23, 'Rain, freezing'],
  [24, 'Rain showers'],
  [25, 'Snow fall'],
  [26, 'Snow showers'],
  [27, 'Snow grains'],
  [28, 'Ice pellets'],
  [29, 'Hail'],
  [30, 'Thunderstorm (no precipitation)'],
  [31, 'Thunderstorm with rain'],
  [32, 'Thunderstorm with hail'],
  [33, 'Thunderstorm with snow'],
  [40, 'Visibility reduced by dust or sand'],
  [41, 'Blowing snow'],
  [42, 'Drifting snow'],
  [43, 'Duststorm'],
  [44, 'Sandstorm'],
  [45, 'Severe duststorm'],
  [46, 'Severe sandstorm'],
  [50, 'Light drizzle'],
  [51, 'Moderate drizzle'],
  [52, 'Heavy drizzle'],
  [53, 'Light rain'],
  [54, 'Moderate rain'],
  [55, 'Heavy rain'],
  [56, 'Light snow'],
  [57, 'Moderate snow'],
  [58, 'Heavy snow'],
  [59, 'Rain and snow mixed'],
  [60, 'Showers, slight'],
  [61, 'Showers, moderate'],
  [62, 'Showers, heavy'],
  [63, 'Thunderstorm, slight'],
  [64, 'Thunderstorm, moderate'],
  [65, 'Thunderstorm, heavy'],
  [66, 'Thunderstorm with hail, slight'],
  [67, 'Thunderstorm with hail, moderate'],
  [68, 'Thunderstorm with hail, heavy'],
  [70, 'Light snow grains'],
  [71, 'Moderate snow grains'],
  [72, 'Heavy snow grains'],
  [73, 'Light ice pellets'],
  [74, 'Moderate ice pellets'],
  [75, 'Heavy ice pellets'],
  [76, 'Light hail'],
  [77, 'Moderate hail'],
  [78, 'Heavy hail'],
  [79, 'Thunderstorm with snow and hail'],
  [80, 'Precipitation, unspecified'],
  [81, 'Rain shower, slight'],
  [82, 'Rain shower, moderate or heavy'],
  [83, 'Snow shower, slight'],
  [84, 'Snow shower, moderate or heavy'],
  [85, 'Hail shower, slight'],
  [86, 'Hail shower, moderate or heavy'],
  [87, 'Drifting snow, light'],
  [88, 'Drifting snow, moderate or heavy'],
  [89, 'Blowing snow, light'],
  [90, 'Blowing snow, moderate or heavy'],
  [91, 'Thunderstorm, no precipitation observed'],
  [92, 'Thunderstorm, precipitation observed'],
  [93, 'Dust or sand raised by wind'],
  [94, 'Duststorm or sandstorm within sight'],
  [95, 'Thunderstorm, slight or moderate'],
  [96, 'Thunderstorm with hail, slight'],
  [97, 'Thunderstorm, heavy'],
  [98, 'Thunderstorm with hail, moderate'],
  [99, 'Thunderstorm with hail, heavy']
]);
