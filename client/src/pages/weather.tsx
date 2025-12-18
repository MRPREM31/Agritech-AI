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
} from "lucide-react";

const API_KEY = "bb4c0817cd95ebca24915ae099e8a8af";

export default function Weather() {
  const [current, setCurrent] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [alertText, setAlertText] = useState("");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        fetchWeatherByCity("Delhi");
      }
    );
  }, []);

  /* ================= FETCH WEATHER ================= */

  async function fetchWeather(lat: number, lon: number) {
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const currentData = await currentRes.json();

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const forecastData = await forecastRes.json();

    setCurrent(currentData);
    setForecast(forecastData.list.filter((_: any, i: number) => i % 8 === 0));
    generateFarmerAlert(currentData);
    setLoading(false);
  }

  async function fetchWeatherByCity(city: string) {
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const currentData = await currentRes.json();

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const forecastData = await forecastRes.json();

    setCurrent(currentData);
    setForecast(forecastData.list.filter((_: any, i: number) => i % 8 === 0));
    generateFarmerAlert(currentData);
    setLoading(false);
  }

  /* ================= FARMER ALERT LOGIC ================= */

  function generateFarmerAlert(data: any) {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;
    const isRain = data.weather[0].main === "Rain";

    let message = "";

    if (isRain) {
      message = "Aaj baarish ka din hai. Kripya spray aur khaad na daalein.";
    } else if (humidity > 80) {
      message = "Aaj hawa mein zyada nami hai. Anaj aur beej ko sookhi jagah rakhein.";
    } else if (wind > 15) {
      message = "Aaj hawa tez chal rahi hai. Spray karna theek nahi hai.";
    } else if (temp >= 20 && temp <= 32) {
      message = "Aaj fasal kaatne ke liye achha din hai.";
    } else {
      message = "Aaj mausam samanya hai. Kheti ka kaam dhyaan se karein.";
    }

    setAlertText(message);
  }

  /* ================= VOICE ================= */

  function speakHindi() {
    const msg = new SpeechSynthesisUtterance(alertText);
    msg.lang = "hi-IN";
    msg.rate = 0.9;

    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
    setSpeaking(true);

    msg.onend = () => setSpeaking(false);
  }

  function stopSpeaking() {
    speechSynthesis.cancel();
    setSpeaking(false);
  }

  if (loading) {
    return (
      <Layout>
        <p className="text-center">🌦️ Mausam jaankari la rahe hain...</p>
      </Layout>
    );
  }

  /* ================= UI ================= */

  return (
    <Layout>
      <h2 className="mb-4 text-2xl font-bold">🌾 Aaj Ka Mausam & Salah</h2>

      {/* CURRENT WEATHER */}
      <Card className="mb-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-4xl font-bold">
              {Math.round(current.main.temp)}°C
            </h3>
            {current.weather[0].main === "Rain" ? (
              <CloudRain className="h-14 w-14" />
            ) : (
              <Sun className="h-14 w-14 text-yellow-300" />
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 text-center text-sm">
            <Info icon={<Wind />} label="Hawa" value={`${current.wind.speed} km/h`} />
            <Info icon={<Droplets />} label="Nami" value={`${current.main.humidity}%`} />
            <Info icon={<ThermometerSun />} label="Stithi" value={current.weather[0].main} />
          </div>
        </CardContent>
      </Card>

      {/* 🌾 FARMER SIMPLE ALERT */}
      <Card className="mb-6 border-l-4 border-l-green-600 bg-green-50">
        <CardContent className="p-4">
          <h4 className="font-bold flex gap-2 mb-2">
            <AlertTriangle className="h-4 w-4" /> Kisan Salah
          </h4>

          <p className="text-sm mb-3">{alertText}</p>

          {!speaking ? (
            <button
              onClick={speakHindi}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              <Volume2 className="h-4 w-4" /> Suno Salah
            </button>
          ) : (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              <Square className="h-4 w-4" /> Band Karein
            </button>
          )}
        </CardContent>
      </Card>

      {/* 📅 5-DAY FUTURE WEATHER */}
      <h3 className="mb-3 text-lg font-bold">📅 Aane Wale 5 Din Ka Mausam</h3>

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
              <p className="font-bold">{Math.round(day.main.temp)}°C</p>
              <p className="text-xs">Nami {day.main.humidity}%</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

/* ===== Small Component ===== */
function Info({ icon, label, value }: any) {
  return (
    <div className="bg-white/10 rounded-lg p-3">
      <div className="mx-auto mb-1">{icon}</div>
      <p className="text-xs">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
