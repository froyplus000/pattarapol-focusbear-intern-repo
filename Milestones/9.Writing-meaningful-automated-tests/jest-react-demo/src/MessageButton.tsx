import { useState } from "react";

export function MessageButton() {
  const [message, setMessage] = useState("Hello World!");

  const changeMessage = () => {
    setMessage("Button was clicked!");
  };

  return (
    <div>
      <h2 data-testid="message">{message}</h2>
      <button data-testid="change-button" onClick={changeMessage}>
        Click Me
      </button>
    </div>
  );
}
