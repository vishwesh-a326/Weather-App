import React from "react";
import "./SafetyDashboard.css";

const SafetyDashboard = ({ weatherData }) => {
  // Comprehensive rule-based logic for safety tips
  const generateSafetyTips = () => {
    const tips = [];
    if (!weatherData) return tips;

    const { main, weather, wind, visibility } = weatherData;
    const temperature = main.temp;
    const humidity = main.humidity;
    const windSpeedKmH = wind.speed * 3.6; // convert m/s to km/h
    const condition = weather[0].main.toLowerCase();

    // Temperature & Heat
    if (temperature >= 35) {
      tips.push({ icon: "🔥", text: "Extreme heat warning. Stay hydrated, stay indoors, and avoid strenuous activities." });
    } else if (temperature >= 30 && humidity > 60) {
      tips.push({ icon: "💦", text: "High heat index. The muggy weather may cause exhaustion. Wear breathable fabrics." });
    } else if (temperature >= 25 && condition.includes("clear")) {
      tips.push({ icon: "🧴", text: "High UV risk likely. Apply broad-spectrum sunscreen and wear sunglasses." });
    }

    // Cold Weather
    if (temperature <= 0) {
      tips.push({ icon: "❄️", text: "Freezing temperatures. Frostbite risk is elevated. Dress in heavy layers and cover exposed skin." });
    } else if (temperature < 15) {
      tips.push({ icon: "🧥", text: "Chilly weather. A light jacket or sweater is recommended for outdoor comfort." });
    }

    // Wind
    if (windSpeedKmH > 70) {
      tips.push({ icon: "🌪️", text: "Severe wind warning. Stay away from windows and watch out for falling debris." });
    } else if (windSpeedKmH > 40) {
      tips.push({ icon: "💨", text: "Gale force winds. Secure loose outdoor objects and exercise caution while driving." });
    }

    // Visibility
    if (visibility < 2000) {
      tips.push({ icon: "🌫️", text: "Low visibility limit. If driving, reduce speed significantly and use fog lights." });
    }

    // Specific Weather Conditions
    if (condition.includes("thunderstorm")) {
      tips.push({ icon: "⚡", text: "Thunderstorm active. Unplug sensitive electronics and stay away from running water." });
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      tips.push({ icon: "☔", text: "Rainy conditions. Carry an umbrella and wear footwear with good traction." });
    } else if (condition.includes("snow")) {
      tips.push({ icon: "⛄", text: "Snow accumulation. Keep emergency kits in your car and wear insulated boots." });
    } else if (condition.includes("fog") || condition === "mist" || condition === "haze") {
      tips.push({ icon: "🌁", text: "Foggy conditions. Maintain extra following distance on the road." });
    } else if (condition === "smoke" || condition === "dust" || condition === "sand" || condition === "ash") {
      tips.push({ icon: "😷", text: "Poor air quality. Consider wearing a mask outdoors and keep home windows closed." });
    } else if (condition === "tornado") {
      tips.push({ icon: "🚨", text: "TORNADO WARNING. Seek shelter immediately in a basement or an interior room." });
    }

    // Default tip if no extreme weather conditions apply
    if (tips.length === 0) {
      tips.push({ icon: "✅", text: "Optimal weather conditions. It's a great day to spend time outdoors!" });
    }

    return tips;
  };

  const safetyTips = generateSafetyTips();

  return (
    <div className="safety-dashboard">
      <h2 className="safety-title">Safety Advisory</h2>
      <div className="safety-cards">
        {safetyTips.map((tip, index) => (
          <div key={index} className="safety-card fade-up">
            <div className="safety-icon" style={{ fontSize: '28px', marginBottom: '12px' }}>{tip.icon}</div>
            <p>{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SafetyDashboard;