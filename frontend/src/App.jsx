import { useEffect, useState, useRef } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [cards, setCards] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    axios.get("/api/cards")
      .then(res => setCards(res.data))
      .catch(err => console.error(err));
  }, []);

  // Create a new card at default position and POST it
  const createCard = () => {
    const newCard = {
      text: "New card",
      x_pos: 100,
      y_pos: 100,
    };
    axios.post("/api/cards", newCard)
      .then(res => {
        setCards([...cards, res.data]); // use the card returned from backend with real id
      })
      .catch(err => console.error(err));
  };

  // Start dragging a card
  const onMouseDown = (e, card) => {
    setDraggingId(card.id);
    dragOffset.current = {
      x: e.clientX - card.x_pos,
      y: e.clientY - card.y_pos,
    };
  };

  // Handle dragging movement (update UI only)
  const onMouseMove = (e) => {
    if (draggingId === null) return;
    setCards(cards.map(card => {
      if (card.id === draggingId) {
        return {
          ...card,
          x_pos: e.clientX - dragOffset.current.x,
          y_pos: e.clientY - dragOffset.current.y,
        };
      }
      return card;
    }));
  };

  // Stop dragging and send PUT update to backend
  const onMouseUp = () => {
    if (draggingId === null) return;
    const draggedCard = cards.find(card => card.id === draggingId);
    if (draggedCard) {
      axios.put(`/api/cards/${draggingId}`, {
        x_pos: draggedCard.x_pos,
        y_pos: draggedCard.y_pos,
      }).catch(err => console.error(err));
    }
    setDraggingId(null);
  };

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{ height: "100vh", position: "relative", userSelect: draggingId ? "none" : "auto" }}
    >
	<div className="menuBar">
	  <div>
	    <select style={{ padding: '0.3rem' }}>
	      <option>Canvas 1</option>
	      <option>Canvas 2</option>
	      <option>Canvas 3</option>
	    </select>
	  </div>
	  <div style={{ fontWeight: 'bold' }}>Noteplane</div>
	  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
	    <button>⚙️</button>
	    <img
	      src="https://www.gravatar.com/avatar/?d=mp"
	      alt="User"
	      style={{ width: 32, height: 32, borderRadius: '50%' }}
	    />
	  </div>
	</div>
      <button onClick={createCard}>Create Card</button>
      <div>
	{cards.map(card => (
	  <div
	    key={card.id}
	    className="card"
	    onMouseDown={(e) => onMouseDown(e, card)}
	    style={{
	      position: 'absolute',
	      left: card.x_pos,
	      top: card.y_pos,
	      padding: '10px',
	      background: 'grey',
	      cursor: 'move',
	      userSelect: 'none',
	      width: 150,
	      maxWidth: '80vw',
	    }}
          >
            {card.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
