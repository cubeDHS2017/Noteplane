// src/App.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios.get("/api/cards")
      .then(res => setCards(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Noteplane Cards</h1>
      <div>
        {cards.map(card => (
          <div key={card.id} style={{
            position: 'absolute',
            left: card.x_pos,
            top: card.y_pos,
            border: '1px solid black',
            padding: '10px',
            background: 'white'
          }}>
            {card.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
