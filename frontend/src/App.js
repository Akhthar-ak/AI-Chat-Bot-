import React, { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm FitBot AI Coach. Ask me about workouts, diet, or fitness progress!",
    },
  ]);

  const [input, setInput] = useState("");
  const [workouts, setWorkouts] = useState([]);

  // ✅ Control Workout Form View
  const [showWorkoutForms, setShowWorkoutForms] = useState(false);

  // ============================
  // FETCH WORKOUT FORMS
  // ============================
  const fetchWorkoutForms = async () => {
    const res = await fetch("http://localhost:5000/workouts");
    const data = await res.json();
    setWorkouts(data);

    // Show Workout Section + Hide Chat
    setShowWorkoutForms(true);
  };

  // ============================
  // SEND MESSAGE TO BACKEND
  // ============================
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Hide Workout Forms when chatting
    setShowWorkoutForms(false);

    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const botMsg = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Backend not responding!" },
      ]);
    }
  };

  // ============================
  // BUTTON ACTIONS
  // ============================
  const handleWorkoutPlan = () => {
    setShowWorkoutForms(false);
    sendMessage("workout plan for beginner");
  };

  const handleDietFatLoss = () => {
    setShowWorkoutForms(false);
    sendMessage("diet plan for fat loss");
  };

  const handleDietMuscleGain = () => {
    setShowWorkoutForms(false);
    sendMessage("diet plan for muscle gain");
  };

  // ============================
  // UI START
  // ============================
  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <h1>💪 FitBot AI Fitness Coach</h1>
        <p>Your Personal Workout • Diet • Progress Assistant</p>
      </header>

      {/* BUTTON PANEL */}
      <div className="button-panel">
        <button onClick={handleWorkoutPlan}>🏋️ Workout Plan</button>
        <button onClick={handleDietFatLoss}>🥗 Diet for Fat Loss</button>
        <button onClick={handleDietMuscleGain}>🍗 Diet for Muscle Gain</button>
        <button onClick={fetchWorkoutForms}>🎥 Workout Form</button>
      </div>

      {/* ============================
          WORKOUT FORM SECTION
      ============================ */}
      {showWorkoutForms && (
        <div className="workoutBox">
          <h2>🎥 Workout Form Tutorials</h2>

          <div className="workoutList">
            {workouts.map((w, index) => (
              <div key={index} className="workoutCard">
                <h3>{w.name}</h3>

                {/* ✅ Description */}
                <p>{w.desc}</p>

                {/* ✅ YouTube Link */}
                <a
                  href={w.link}
                  target="_blank"
                  rel="noreferrer"
                  className="ytButton"
                >
                  ▶ Watch Tutorial
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================
          CHAT SECTION (Hidden when Workout Forms Open)
      ============================ */}
      {!showWorkoutForms && (
        <>
          {/* CHAT BOX */}
          <div className="chat-container">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.sender === "user" ? "user" : "bot"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* INPUT AREA */}
          <div className="input-area">
            <input
              type="text"
              placeholder="Ask FitBot something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              onClick={() => {
                sendMessage(input);
                setInput("");
              }}
            >
              Send 🚀
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
