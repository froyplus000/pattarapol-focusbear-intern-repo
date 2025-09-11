import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "./store/store";
import {
  increment,
  decrement,
  reset,
  incrementByAmount,
  incrementAsync,
} from "./store/counterSlice";

const Counter = () => {
  const {
    value: count,
    loading,
    error,
  } = useSelector((state: RootState) => state.counter);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Redux Counter</h2>
      <p style={{ fontSize: "24px", margin: "20px 0" }}>
        Count: <span data-testid="counter-value">{count}</span>
      </p>
      {loading && (
        <p data-testid="loading-indicator" style={{ color: "blue" }}>
          Loading...
        </p>
      )}
      {error && (
        <p data-testid="error-message" style={{ color: "red" }}>
          Error: {error}
        </p>
      )}
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          data-testid="increment-btn"
          onClick={() => dispatch(increment())}
          style={{ padding: "10px 20px", fontSize: "16px" }}
          disabled={loading}
        >
          +1
        </button>
        <button
          data-testid="decrement-btn"
          onClick={() => dispatch(decrement())}
          style={{ padding: "10px 20px", fontSize: "16px" }}
          disabled={loading}
        >
          -1
        </button>
        <button
          data-testid="increment-by-5-btn"
          onClick={() => dispatch(incrementByAmount(5))}
          style={{ padding: "10px 20px", fontSize: "16px" }}
          disabled={loading}
        >
          +5
        </button>
        <button
          data-testid="increment-async-btn"
          onClick={() => dispatch(incrementAsync(3))}
          style={{ padding: "10px 20px", fontSize: "16px" }}
          disabled={loading}
        >
          +3 Async
        </button>
        <button
          data-testid="reset-btn"
          onClick={() => dispatch(reset())}
          style={{ padding: "10px 20px", fontSize: "16px" }}
          disabled={loading}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Counter;
