import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Counter from "../Counter";
import counterReducer from "../store/counterSlice";

// Helper function to create a new store for testing
const createTestStore = (initialState = { counter: { value: 0 } }) => {
  return configureStore({
    reducer: {
      counter: counterReducer,
    },
    preloadedState: initialState,
  });
};

// Helper function to render component with Redux store
const renderWithRedux = (
  component: React.ReactElement,
  initialState?: { counter: { value: number } }
) => {
  const store = createTestStore(initialState);
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe("Counter Component", () => {
  it("renders initial count value", () => {
    renderWithRedux(<Counter />);
    const counterValue = screen.getByTestId("counter-value");
    expect(counterValue.textContent).toBe("0");
  });

  it("renders with custom initial state", () => {
    renderWithRedux(<Counter />, { counter: { value: 5 } });
    const counterValue = screen.getByTestId("counter-value");
    expect(counterValue.textContent).toBe("5");
  });

  it("increments count when increment button is clicked", () => {
    renderWithRedux(<Counter />);

    const incrementBtn = screen.getByTestId("increment-btn");
    fireEvent.click(incrementBtn);

    const counterValue = screen.getByTestId("counter-value");
    expect(counterValue.textContent).toBe("1");
  });

  it("decrements count when decrement button is clicked", () => {
    renderWithRedux(<Counter />, { counter: { value: 5 } });

    const decrementBtn = screen.getByTestId("decrement-btn");
    fireEvent.click(decrementBtn);

    const counterValue = screen.getByTestId("counter-value");
    expect(counterValue.textContent).toBe("4");
  });

  it("increments by 5 when +5 button is clicked", () => {
    renderWithRedux(<Counter />);

    const incrementBy5Btn = screen.getByTestId("increment-by-5-btn");
    fireEvent.click(incrementBy5Btn);

    const counterValue = screen.getByTestId("counter-value");
    expect(counterValue.textContent).toBe("5");
  });

  it("resets count when reset button is clicked", () => {
    renderWithRedux(<Counter />, { counter: { value: 10 } });

    const resetBtn = screen.getByTestId("reset-btn");
    fireEvent.click(resetBtn);

    const counterValue = screen.getByTestId("counter-value");
    expect(counterValue.textContent).toBe("0");
  });

  it("handles multiple button clicks correctly", () => {
    renderWithRedux(<Counter />);

    const incrementBtn = screen.getByTestId("increment-btn");
    const incrementBy5Btn = screen.getByTestId("increment-by-5-btn");

    // Click increment 3 times (3) + click +5 once (5) = 8
    fireEvent.click(incrementBtn);
    fireEvent.click(incrementBtn);
    fireEvent.click(incrementBtn);
    fireEvent.click(incrementBy5Btn);

    const counterValue = screen.getByTestId("counter-value");
    expect(counterValue.textContent).toBe("8");
  });
});
