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
  Volume2,
  Square,
  MapPin,
} from "lucide-react";

const API_KEY = "bb4c0817cd95ebca24915ae099e8a8af";

export default function Weather() {
  const [current, setCurrent] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertText, setAlertText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [locationSource, setLocationSource] = useState("");

  /* ================= GEO ================= */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationSource("GPS Location");
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocationSource("City Fallback");
        fetchWeatherByCity("Delhi");
      }
    );
  }, []);

  /* 🔹 NEW: AUTO REFRESH WEATHER EVERY 30 MINUTES */
  useEffect(() => {
    if (!current?.coord) return;

    const interval = setInterval(() => {
      fetchWeather(current.coord.lat, current.coord.lon);
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [current]);

  /* ================= FETCH ================= */

  async function fetchWeather(lat: number, lon: number) {
    try {
      const c = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const currentData = await c.json();

      const f = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await f.json();

      setCurrent(currentData);
      setForecast(forecastData.list.filter((_: any, i: number) => i % 8 === 0));
      generateFarmerAlert(currentData);
    } catch {
      setAlertText("❌ Mausam data load nahi ho paya");
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeatherByCity(city: string) {
    try {
      const c = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const currentData = await c.json();

      const f = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await f.json();

      setCurrent(currentData);
      setForecast(forecastData.list.filter((_: any, i: number) => i % 8 === 0));
      generateFarmerAlert(currentData);
    } catch {
      setAlertText("❌ Shehar ka mausam load nahi ho paya");
    } finally {
      setLoading(false);
    }
  }

  /* ================= FARMER ALERT ================= */

  function generateFarmerAlert(data: any) {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const windKmH = data.wind.speed * 3.6;
    const rain = data.weather[0].main === "Rain";

    let msg = "Aaj mausam samanya hai. Kheti ka kaam dhyaan se karein.";

    if (rain) msg = "Aaj baarish ka din hai. Spray aur khaad na daalein.";
    else if (humidity > 80) msg = "Zyada nami hai. Beej sookhi jagah rakhein.";
    else if (windKmH > 15) msg = "Tez hawa hai. Spray avoid karein.";
    else if (temp >= 20 && temp <= 32)
      msg = "Aaj fasal kaatne ke liye achha din hai.";

    /* 🔹 NEW: TIME-BASED DYNAMIC ADDITION */
    const hour = new Date().getHours();

    if (hour < 10) {
      msg += " Subah ka samay hai, sinchai ka nirnay soch samajh kar lein.";
    } else if (hour < 16) {
      msg += " Dopahar mein spray karna uchit nahi hota.";
    } else {
      msg += " Shaam ke samay fasal aur upkaran surakshit rakhein.";
    }

    setAlertText(msg);
  }

  /* ================= VOICE ================= */

  function speakHindi() {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(alertText);
    u.lang = "hi-IN";
    u.rate = 0.9;

    const voices = speechSynthesis.getVoices();
    const hi = voices.find((v) => v.lang.startsWith("hi"));
    if (hi) u.voice = hi;

    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);

    speechSynthesis.speak(u);
  }

  function stopSpeaking() {
    speechSynthesis.cancel();
    setSpeaking(false);
  }

  if (loading) {
    return (
      <Layout>
        <p className="text-center text-lg">
          🌦️ Mausam jaankari la rahe hain...
        </p>
      </Layout>
    );
  }

  /* ================= UI ================= */

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-green-700">
          🌾 Aaj Ka Mausam & Salah
        </h2>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {current.name}, {current.sys.country} • {locationSource}
        </p>
      </div>

      <Card className="mb-6 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 text-white shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Temperature</p>
              <h3 className="text-5xl font-extrabold">
                {Math.round(current.main.temp)}°C
              </h3>
              <p className="capitalize text-sm mt-1">
                {current.weather[0].description}
              </p>
            </div>

            <div className="animate-pulse">
              {current.weather[0].main === "Rain" ? (
                <CloudRain className="h-20 w-20 opacity-90" />
              ) : (
                <Sun className="h-20 w-20 text-yellow-300 drop-shadow-[0_0_15px_rgba(255,255,0,0.8)]" />
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <Info icon={<Wind className="mx-auto" />} label="Hawa" value={`${(current.wind.speed * 3.6).toFixed(1)} km/h`} />
            <Info icon={<Droplets className="mx-auto" />} label="Nami" value={`${current.main.humidity}%`} />
            <Info icon={<ThermometerSun className="mx-auto" />} label="Stithi" value={current.weather[0].main} />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 rounded-xl bg-green-50 border-l-8 border-green-600 shadow-md">
        <CardContent className="p-5">
          <h4 className="flex items-center gap-2 font-bold text-green-800 mb-2">
            <AlertTriangle className="h-5 w-5" />
            Kisan Salah
          </h4>

          <p className="mb-4 text-gray-800 leading-relaxed">
            {alertText}
          </p>

          {!speaking ? (
            <button onClick={speakHindi} className="flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-green-700 transition">
              <Volume2 className="h-5 w-5" />
              Suno Salah
            </button>
          ) : (
            <button onClick={stopSpeaking} className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-red-700 transition">
              <Square className="h-5 w-5" />
              Band Karein
            </button>
          )}
        </CardContent>
      </Card>

      <h3 className="mb-3 text-xl font-bold">
        📅 Aane Wale 5 Din Ka Mausam
      </h3>

      <div className="space-y-3">
        {forecast.map((day, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
            <div>
              <p className="font-semibold">
                {new Date(day.dt_txt).toDateString()}
              </p>
              <p className="text-xs capitalize text-muted-foreground">
                {day.weather[0].description}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">{Math.round(day.main.temp)}°C</p>
              <p className="text-xs">Nami {day.main.humidity}%</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

/* ================= INFO CARD ================= */

function Info({ icon, label, value }: any) {
  return (
    <div className="rounded-lg bg-white/10 p-3 flex flex-col items-center gap-1">
      {icon}
      <p className="text-xs">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
