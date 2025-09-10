import "./App.css";
import { MessageButton } from "./MessageButton";
import { UserProfile } from "./UserProfile";

function App() {
  return (
    <>
      <div className="card">
        <h1>React Component Testing Demo</h1>
        <MessageButton />
        <hr />
        <UserProfile />
      </div>
    </>
  );
}

export default App;
