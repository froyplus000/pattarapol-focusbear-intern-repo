import counterReducer, {
  increment,
  decrement,
  incrementByAmount,
  reset,
  incrementAsync,
} from "../store/counterSlice";
import { configureStore } from "@reduxjs/toolkit";

describe("counter slice", () => {
  const initialState = { value: 0, loading: false, error: null };

  it("should return the initial state", () => {
    expect(counterReducer(undefined, { type: "unknown" })).toEqual(
      initialState
    );
  });

  it("should handle increment", () => {
    const actual = counterReducer(initialState, increment());
    expect(actual.value).toEqual(1);
    expect(actual.loading).toBe(false);
    expect(actual.error).toBe(null);
  });

  it("should handle decrement", () => {
    const actual = counterReducer(
      { value: 5, loading: false, error: null },
      decrement()
    );
    expect(actual.value).toEqual(4);
  });

  it("should handle incrementByAmount", () => {
    const actual = counterReducer(initialState, incrementByAmount(5));
    expect(actual.value).toEqual(5);
  });

  it("should handle reset", () => {
    const actual = counterReducer(
      { value: 10, loading: true, error: "Some error" },
      reset()
    );
    expect(actual.value).toEqual(0);
    expect(actual.loading).toBe(false);
    expect(actual.error).toBe(null);
  });

  it("should handle multiple increments", () => {
    let state = initialState;
    state = counterReducer(state, increment());
    state = counterReducer(state, increment());
    state = counterReducer(state, increment());
    expect(state.value).toEqual(3);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  describe("async actions", () => {
    it("should handle incrementAsync.pending", () => {
      const action = { type: incrementAsync.pending.type };
      const state = counterReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle incrementAsync.fulfilled", () => {
      const action = { type: incrementAsync.fulfilled.type, payload: 5 };
      const state = counterReducer(
        { value: 2, loading: true, error: null },
        action
      );
      expect(state.loading).toBe(false);
      expect(state.value).toBe(7);
    });

    it("should handle incrementAsync.rejected", () => {
      const action = {
        type: incrementAsync.rejected.type,
        error: { message: "Network error" },
      };
      const state = counterReducer(
        { value: 2, loading: true, error: null },
        action
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Network error");
      expect(state.value).toBe(2); // value shouldn't change on error
    });
  });

  describe("integration test with store", () => {
    it("should handle async increment action with real store", async () => {
      const store = configureStore({
        reducer: {
          counter: counterReducer,
        },
      });

      // Initial state
      expect(store.getState().counter.value).toBe(0);
      expect(store.getState().counter.loading).toBe(false);

      // Dispatch async action
      const promise = store.dispatch(incrementAsync(3));

      // Should be loading
      expect(store.getState().counter.loading).toBe(true);

      // Wait for completion
      await promise;

      // Should be completed
      expect(store.getState().counter.loading).toBe(false);
      expect(store.getState().counter.value).toBe(3);
    });
  });
});
