import "./App.css";
import { MessageButton } from "./MessageButton";
import { UserProfile } from "./UserProfile";
import Counter from "./Counter";

function App() {
  return (
    <>
      <div className="card">
        <h1>React Component Testing Demo</h1>
        <Counter />
        <hr />
        <MessageButton />
        <hr />
        <UserProfile />
      </div>
    </>
  );
}

export default App;
