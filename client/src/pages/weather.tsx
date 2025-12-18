import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  ThermometerSun,
  AlertTriangle,
  MapPin,
} from "lucide-react";

const API_KEY = "bb4c0817cd95ebca24915ae099e8a8af";

export default function Weather() {
  const [current, setCurrent] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [location, setLocation] = useState<string>("Detecting location...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      fetchWeatherByCity("Delhi");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => {
        // ❌ Permission denied → fallback
        fetchWeatherByCity("Delhi");
      }
    );
  }, []);

  async function fetchWeatherByCoords(lat: number, lon: number) {
    try {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const currentData = await currentRes.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();

      setCurrent(currentData);
      setLocation(`${currentData.name}, ${currentData.sys.country}`);

      const daily = forecastData.list.filter((_: any, i: number) => i % 8 === 0);
      setForecast(daily);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch weather");
      setLoading(false);
    }
  }

  async function fetchWeatherByCity(city: string) {
    try {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const currentData = await currentRes.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();

      setCurrent(currentData);
      setLocation(`${currentData.name}, ${currentData.sys.country}`);

      const daily = forecastData.list.filter((_: any, i: number) => i % 8 === 0);
      setForecast(daily);
      setLoading(false);
    } catch {
      setError("Weather unavailable");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <p className="text-center text-muted-foreground">
          🌍 Detecting your location & weather...
        </p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p className="text-center text-red-500">{error}</p>
      </Layout>
    );
  }

  const isRain = current.weather[0].main === "Rain";

  return (
    <Layout>
      <h2 className="mb-6 text-2xl lg:text-3xl font-bold text-secondary">
        Live Weather & Farmer Alerts
      </h2>

      {/* Current Weather */}
      <Card className="mb-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-4xl font-bold">
                {Math.round(current.main.temp)}°C
              </h3>
              <div className="flex items-center gap-1 text-white/90">
                <MapPin className="h-4 w-4" />
                <p>{location}</p>
              </div>
            </div>
            {isRain ? (
              <CloudRain className="h-20 w-20 animate-pulse" />
            ) : (
              <Sun className="h-20 w-20 text-yellow-300 animate-pulse" />
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-3">
              <Wind className="h-5 w-5 mx-auto mb-1" />
              <p className="text-xs">Wind</p>
              <p className="font-bold">{current.wind.speed} km/h</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <Droplets className="h-5 w-5 mx-auto mb-1" />
              <p className="text-xs">Humidity</p>
              <p className="font-bold">{current.main.humidity}%</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <ThermometerSun className="h-5 w-5 mx-auto mb-1" />
              <p className="text-xs">Condition</p>
              <p className="font-bold">{current.weather[0].main}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {current.main.temp > 35 && (
          <Card className="border-l-4 border-l-red-500 bg-red-50">
            <CardContent className="p-4">
              <h4 className="font-bold flex gap-2">
                <AlertTriangle className="h-4 w-4" /> Heat Alert
              </h4>
              <p className="text-sm mt-1">
                High temperature detected. Water crops in evening.
              </p>
            </CardContent>
          </Card>
        )}

        {isRain && (
          <Card className="border-l-4 border-l-blue-500 bg-blue-50">
            <CardContent className="p-4">
              <h4 className="font-bold flex gap-2">
                <AlertTriangle className="h-4 w-4" /> Rain Alert
              </h4>
              <p className="text-sm mt-1">
                Rain expected. Avoid spraying pesticides.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Forecast */}
      <div>
        <h3 className="mb-3 text-lg font-bold">5-Day Forecast</h3>
        <div className="space-y-3">
          {forecast.map((day, i) => (
            <div
              key={i}
              className="flex justify-between bg-white p-4 rounded-xl border"
            >
              <div>
                <p className="font-semibold">
                  {new Date(day.dt_txt).toDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {day.weather[0].description}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">
                  {Math.round(day.main.temp)}°C
                </p>
                <p className="text-xs">
                  Humidity {day.main.humidity}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
