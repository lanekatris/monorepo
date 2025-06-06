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
> = new Map<number, { description: string; emoji: string }>([
  [0, { description: 'Clear sky', emoji: '☀️' }],
  [1, { description: 'Mostly clear', emoji: '🌤️' }],
  [2, { description: 'Partly cloudy', emoji: '⛅' }],
  [3, { description: 'Overcast', emoji: '☁️' }],
  [45, { description: 'Fog', emoji: '🌫️' }],
  [48, { description: 'Depositing rime fog', emoji: '🌁' }],
  [51, { description: 'Light drizzle', emoji: '🌦️' }],
  [53, { description: 'Moderate drizzle', emoji: '🌧️' }],
  [55, { description: 'Dense drizzle', emoji: '🌧️' }],
  [61, { description: 'Slight rain', emoji: '🌦️' }],
  [63, { description: 'Moderate rain', emoji: '🌧️' }],
  [65, { description: 'Heavy rain', emoji: '🌧️' }],
  [66, { description: 'Freezing rain (light)', emoji: '🌨️' }],
  [67, { description: 'Freezing rain (heavy)', emoji: '🌨️' }],
  [71, { description: 'Light snow', emoji: '❄️' }],
  [73, { description: 'Moderate snow', emoji: '❄️' }],
  [75, { description: 'Heavy snow', emoji: '❄️' }],
  [77, { description: 'Snow grains', emoji: '🌨️' }],
  [80, { description: 'Slight rain showers', emoji: '🌦️' }],
  [81, { description: 'Moderate rain showers', emoji: '🌧️' }],
  [82, { description: 'Violent rain showers', emoji: '⛈️' }],
  [85, { description: 'Slight snow showers', emoji: '❄️' }],
  [86, { description: 'Heavy snow showers', emoji: '❄️' }],
  [95, { description: 'Thunderstorm (slight to moderate)', emoji: '⛈️' }],
  [96, { description: 'Thunderstorm with hail (slight)', emoji: '🌩️' }],
  [99, { description: 'Thunderstorm with hail (heavy)', emoji: '🌩️' }]
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
export const weatherEmojisV2: Record<number, string> = {
  0: '☀️', // Clear sky
  1: '🌤️', // Mostly clear
  2: '⛅', // Partly cloudy
  3: '☁️', // Overcast
  45: '🌫️', // Fog
  48: '🌁', // Depositing rime fog
  51: '🌦️', // Light drizzle
  53: '🌧️', // Moderate drizzle
  55: '🌧️', // Dense drizzle
  61: '🌦️', // Slight rain
  63: '🌧️', // Moderate rain
  65: '🌧️', // Heavy rain
  66: '🌨️', // Freezing rain (light)
  67: '🌨️', // Freezing rain (heavy)
  71: '❄️', // Light snow
  73: '❄️', // Moderate snow
  75: '❄️', // Heavy snow
  77: '🌨️', // Snow grains
  80: '🌦️', // Slight rain showers
  81: '🌧️', // Moderate rain showers
  82: '⛈️', // Violent rain showers
  85: '❄️', // Slight snow showers
  86: '❄️', // Heavy snow showers
  95: '⛈️', // Thunderstorm (slight to moderate)
  96: '🌩️', // Thunderstorm with hail (slight)
  99: '🌩️' // Thunderstorm with hail (heavy)
};
