// 오늘의 날씨: Open-Meteo (API 키 없이 사용 가능)
const CITIES = [
  { id: "weather-seoul", name: "서울", latitude: 37.5665, longitude: 126.978 },
  { id: "weather-jeju", name: "제주", latitude: 33.4996, longitude: 126.5312 },
];

// WMO 날씨 코드 → [설명, 아이콘]
const WEATHER_CODES = {
  0: ["맑음", "☀️"],
  1: ["대체로 맑음", "🌤️"],
  2: ["부분 흐림", "⛅"],
  3: ["흐림", "☁️"],
  45: ["안개", "🌫️"],
  48: ["서리 안개", "🌫️"],
  51: ["약한 이슬비", "🌦️"],
  53: ["이슬비", "🌦️"],
  55: ["강한 이슬비", "🌧️"],
  56: ["약한 어는 이슬비", "🌧️"],
  57: ["강한 어는 이슬비", "🌧️"],
  61: ["약한 비", "🌦️"],
  63: ["비", "🌧️"],
  65: ["강한 비", "🌧️"],
  66: ["약한 어는 비", "🌧️"],
  67: ["강한 어는 비", "🌧️"],
  71: ["약한 눈", "🌨️"],
  73: ["눈", "🌨️"],
  75: ["강한 눈", "❄️"],
  77: ["싸락눈", "🌨️"],
  80: ["약한 소나기", "🌦️"],
  81: ["소나기", "🌧️"],
  82: ["강한 소나기", "⛈️"],
  85: ["약한 눈 소나기", "🌨️"],
  86: ["강한 눈 소나기", "❄️"],
  95: ["뇌우", "⛈️"],
  96: ["우박을 동반한 뇌우", "⛈️"],
  99: ["강한 우박을 동반한 뇌우", "⛈️"],
};

async function loadWeather(city) {
  const chip = document.getElementById(city.id);
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${city.latitude}&longitude=${city.longitude}` +
    "&current=temperature_2m,weather_code&timezone=Asia%2FSeoul";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const temperature = Math.round(data.current.temperature_2m * 10) / 10;
    const [description, icon] = WEATHER_CODES[data.current.weather_code] || ["알 수 없음", "🌡️"];

    chip.textContent = `${city.name}: ${temperature}°C ${description} ${icon}`;
  } catch (error) {
    console.error(`${city.name} 날씨를 불러오지 못했습니다.`, error);
    chip.textContent = `${city.name}: 날씨 정보 없음`;
  }
}

// 오늘의 명언
const QUOTES = [
  ["삶이 있는 한 희망은 있다.", "키케로"],
  ["천 리 길도 한 걸음부터.", "노자"],
  ["아는 것이 힘이다.", "프랜시스 베이컨"],
  ["시작이 반이다.", "아리스토텔레스"],
  ["너 자신을 알라.", "소크라테스"],
  ["상상력은 지식보다 중요하다.", "알베르트 아인슈타인"],
  ["배우고 때때로 익히면 또한 기쁘지 아니한가.", "공자"],
  ["오늘 할 수 있는 일을 내일로 미루지 마라.", "벤저민 프랭클린"],
  ["인생은 가까이서 보면 비극이지만 멀리서 보면 희극이다.", "찰리 채플린"],
  ["나는 생각한다, 고로 존재한다.", "르네 데카르트"],
];

// 새로고침할 때마다 직전과 다른 명언이 나오도록 마지막 명언을 기억함
const LAST_QUOTE_KEY = "startPage.lastQuote";

function showRandomQuote() {
  let lastQuote = null;
  try {
    lastQuote = localStorage.getItem(LAST_QUOTE_KEY);
  } catch (error) {
    // 브라우저 저장소를 쓸 수 없으면 직전 명언을 모르는 채로 뽑음
  }

  let text, author;
  do {
    [text, author] = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  } while (QUOTES.length > 1 && text === lastQuote);

  document.getElementById("quote").textContent = `"${text}" - ${author}`;

  try {
    localStorage.setItem(LAST_QUOTE_KEY, text);
  } catch (error) {
    // 저장하지 못해도 명언 표시는 그대로 됨
  }
}

// 검색어가 비어 있으면 구글로 넘어가지 않음
document.getElementById("search-form").addEventListener("submit", (event) => {
  const input = document.getElementById("search-input");
  if (!input.value.trim()) {
    event.preventDefault();
    input.focus();
  }
});

CITIES.forEach(loadWeather);
showRandomQuote();
