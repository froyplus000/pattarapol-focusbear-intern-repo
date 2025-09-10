# Unit Testing with Jest - Documentation and Reflection #74

## 📖 Overview

This document covers the implementation of unit testing using Jest in a React TypeScript project. The goal was to learn the basics of unit testing, set up Jest, write simple tests, and understand the importance of automated testing in software development.

## 🛠️ What We Accomplished

### 1. Project Setup

We created a React project with Vite and TypeScript that includes:

- **Jest** for testing framework
- **ts-jest** for TypeScript support
- **@types/jest** for TypeScript definitions

### 2. Dependencies and Configuration

**Key Dependencies Added:**

```json
{
  "devDependencies": {
    "@types/jest": "^30.0.0",
    "jest": "^30.1.3",
    "ts-jest": "^29.4.1"
  }
}
```

**Jest Configuration (`jest.config.js`):**

```javascript
import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};
```

**Note:** We encountered and resolved an ES module compatibility issue where the Jest config needed to use `import` syntax instead of `require()` due to the project being configured as an ES module with `"type": "module"` in package.json.

### 3. Implementation Details

#### Math Utility Function (`src/utils/math.ts`)

We created a simple utility function to demonstrate unit testing:

```typescript
export function add(a: number, b: number): number {
  return a + b;
}
```

![Math Logic Code](jest-react-demo/screenshots/code-math-logic.png)

#### Unit Tests (`src/__test__/math.test.ts`)

We wrote comprehensive tests for the utility function:

```typescript
import { add } from "../utils/math";

describe("add", () => {
  it("adds two positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("handles zeros", () => {
    expect(add(0, 0)).toBe(0);
  });
});
```

![Test Code](jest-react-demo/screenshots/code-test-math-jest.png)

### 4. Running Tests

Tests can be executed using:

```bash
npm test
```

The test output shows successful execution:

![Test Output](jest-react-demo/screenshots/test-output.png)

**Test Results:**

- ✅ 2 tests passed
- ✅ 1 test suite passed

## 🔧 Technical Challenges Encountered

### ES Module Compatibility Issue

**Problem:** Initially encountered a `ReferenceError: require is not defined in ES module scope` error.

**Root Cause:** The project was configured as an ES module (`"type": "module"` in package.json), but Jest configuration was using CommonJS syntax.

**Solution:** Converted Jest configuration from:

```javascript
const { createDefaultPreset } = require("ts-jest"); // ❌ CommonJS
```

To:

```javascript
import { createDefaultPreset } from "ts-jest"; // ✅ ES Module
```

## 🎯 Learning Outcomes

### What is Jest?

Jest is a JavaScript testing framework developed by Facebook that provides:

- **Zero configuration** setup for most projects
- **Built-in test runner** and assertion library
- **Mocking capabilities** for isolating units under test
- **Code coverage reports**
- **Snapshot testing** for UI components
- **Watch mode** for continuous testing during development

### Key Jest Concepts Applied:

- **`describe()`**: Groups related tests together
- **`it()` or `test()`**: Defines individual test cases
- **`expect()`**: Makes assertions about values
- **`.toBe()`**: Matcher for exact equality comparison

## 💭 Reflection

### Why is Automated Testing Important in Software Development?

1. **Regression Prevention**: Automated tests catch bugs when code changes, preventing features from breaking unexpectedly.

2. **Code Reliability**: Tests provide confidence that code behaves as expected under various conditions.

3. **Documentation**: Tests serve as living documentation, showing how functions should be used and what they should return.

4. **Refactoring Safety**: When refactoring code, tests ensure that functionality remains intact.

5. **Continuous Integration**: Automated tests enable CI/CD pipelines, allowing for frequent, reliable deployments.

6. **Cost Reduction**: Finding bugs early in development is significantly cheaper than fixing them in production.

### What Was Challenging When Writing the First Jest Test?

1. **Configuration Setup**: Setting up Jest in a TypeScript + ES Module environment required understanding module systems and resolving compatibility issues.

2. **Understanding Test Structure**: Learning the syntax and structure of Jest tests, including `describe`, `it`, and `expect` patterns.

3. **ES Module vs CommonJS**: Navigating the differences between module systems and ensuring Jest configuration matched the project setup.

4. **TypeScript Integration**: Configuring ts-jest to properly handle TypeScript files and type checking during tests.

### Focus Bear Context Application

In the context of Focus Bear's development:

- **Feature Stability**: Unit tests ensure that productivity features like website blocking, break reminders, and habit tracking work consistently across updates.

- **User Trust**: Automated testing helps maintain the reliability that users depend on for their daily productivity routines.

- **Team Collaboration**: Tests provide clear expectations for how functions should behave, making it easier for team members to understand and modify code.

- **Rapid Development**: With proper test coverage, developers can confidently add new features and fix bugs without worrying about breaking existing functionality.

## 🚀 Next Steps

1. **Expand Test Coverage**: Add tests for edge cases (negative numbers, floating-point precision, etc.)
2. **Component Testing**: Implement tests for React components using React Testing Library
3. **Integration Tests**: Test interactions between multiple components
4. **Mock Implementation**: Learn to mock external dependencies and API calls
5. **Test-Driven Development**: Practice writing tests before implementation

## 📝 Conclusion

This exercise successfully demonstrated the fundamentals of unit testing with Jest in a React TypeScript environment. The hands-on experience of setting up Jest, resolving configuration issues, and writing meaningful tests provides a solid foundation for implementing comprehensive testing strategies in real-world applications like Focus Bear.

The importance of automated testing cannot be overstated - it's an essential practice for maintaining code quality, preventing regressions, and enabling confident development in production applications.

---

# React Component Testing with Jest & React Testing Library - Implementation #75

## 📖 Overview

Building upon our previous Jest setup, we extended the project to include React component testing using Jest and React Testing Library. This implementation demonstrates how to test interactive UI components, simulating user interactions and verifying component behavior.

## 🛠️ What We Updated in the Demo React Project

### 1. Enhanced Jest Configuration

**Updated Jest Configuration (`jest.config.js`):**

![](./jest-react-demo//screenshots/ui-component-test/jest-config-code.png)

```javascript
import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "jsdom", // Changed from "node" to "jsdom"
  transform: {
    ...tsJestTransformCfg,
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], // Added setup file
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"], // Added tsx, jsx support
  globals: {
    "ts-jest": {
      tsconfig: {
        jsx: "react-jsx", // Enable JSX support
      },
    },
  },
};
```

**Key Changes:**

- Changed `testEnvironment` from `"node"` to `"jsdom"` to enable DOM testing
- Added `setupFilesAfterEnv` to configure React Testing Library
- Added support for JSX files with `jsx: "react-jsx"`

### 2. React Testing Library Setup

**Setup File (`src/setupTests.ts`):**

![](./jest-react-demo//screenshots/ui-component-test/setup-test-code.png)

```typescript
import "@testing-library/jest-dom";
```

This setup file extends Jest's `expect` with additional DOM-specific matchers like `toBeInTheDocument()` and `toHaveTextContent()`.

### 3. Additional Dependencies

**New Dependencies Added:**

```bash
npm install --save-dev jest-environment-jsdom
```

This package provides the JSDOM environment required for testing React components.

### 4. Interactive React Component Implementation

#### MessageButton Component (`src/MessageButton.tsx`)

![MessageButton Component Code](./jest-react-demo/screenshots/ui-component-test/message-component-code.png)

```typescript
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
```

**Component Features:**

- **State Management**: Uses `useState` hook to manage the message state
- **User Interaction**: Button click handler that changes the message
- **Test Accessibility**: `data-testid` attributes for reliable test targeting

### 5. Comprehensive Component Tests

#### Component Tests (`src/__test__/MessageButton.test.tsx`)

![MessageButton Test Code](./jest-react-demo/screenshots/ui-component-test/message-test-code.png)

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageButton } from "../MessageButton";

describe("MessageButton Component", () => {
  it("renders with initial message", () => {
    render(<MessageButton />);

    expect(screen.getByTestId("message")).toHaveTextContent("Hello World!");
    expect(screen.getByTestId("change-button")).toBeInTheDocument();
  });

  it("changes message when button is clicked", async () => {
    const user = userEvent.setup();
    render(<MessageButton />);

    const message = screen.getByTestId("message");
    const button = screen.getByTestId("change-button");

    // Initially shows "Hello World!"
    expect(message).toHaveTextContent("Hello World!");

    // Click the button
    await user.click(button);

    // Message should change
    expect(message).toHaveTextContent("Button was clicked!");
  });
});
```

**Test Coverage:**

- **Rendering Test**: Verifies component renders with correct initial state
- **User Interaction Test**: Simulates button click and verifies state change

### 6. Updated App Integration

**App Component Integration (`src/App.tsx`):**

```typescript
import { MessageButton } from "./MessageButton";

// ... existing code ...

<div className="card">
  <h2>React Component Testing Demo</h2>
  <MessageButton />
</div>;
```

## 🧪 Test Output

![React Component Test Output](./jest-react-demo/screenshots/ui-component-test/message-test-output.png)

**Test Results:**

- ✅ 4 tests passed (2 math tests + 2 component tests)
- ✅ 2 test suites passed
- ✅ All tests completed successfully

## 🔧 Technical Challenges Encountered

### 1. JSDOM Environment Setup

**Problem:** `Test environment jest-environment-jsdom cannot be found`

**Solution:** Install the required dependency:

```bash
npm install --save-dev jest-environment-jsdom
```

### 2. JSX Support in Tests

**Problem:** TypeScript couldn't compile JSX in test files

**Solution:** Configure Jest to handle JSX properly:

```javascript
globals: {
  "ts-jest": {
    tsconfig: {
      jsx: "react-jsx",
    },
  },
},
```

## 💭 Reflection on React Component Testing

### What are the benefits of using React Testing Library instead of testing implementation details?

1. **User-Centric Testing**: React Testing Library focuses on testing what users actually see and interact with, rather than internal component implementation details.

2. **Maintainable Tests**: Tests are less likely to break when refactoring component internals, as long as the user experience remains the same.

3. **Accessibility by Default**: The library encourages using accessible queries (like `getByRole`, `getByLabelText`) which promotes better accessibility practices.

4. **Realistic Testing**: Tests interact with components the same way users do - by clicking buttons, typing in inputs, and reading displayed text.

5. **Implementation Agnostic**: Whether you use class components, functional components, hooks, or state management libraries, the tests remain focused on behavior.

### What challenges did you encounter when simulating user interaction?

1. **Asynchronous Nature**: User interactions are asynchronous in React Testing Library, requiring proper use of `async/await` and `userEvent.setup()`.

2. **Event Timing**: Understanding that DOM updates happen asynchronously after user events, requiring careful timing in test assertions.

3. **Setup Requirements**: Configuring the testing environment properly to support DOM manipulation and JSX compilation.

4. **Query Selection**: Learning to choose the right queries (`getByTestId`, `getByRole`, `getByText`) for reliable element selection.

### Focus Bear Application Context

In the context of Focus Bear's development, this React component testing approach would be invaluable for:

1. **Productivity Features**: Testing habit tracker checkboxes, break reminder dialogs, and website blocking toggles to ensure they respond correctly to user interactions.

2. **Settings UI**: Verifying that configuration panels update state correctly when users modify their productivity settings.

3. **Timer Components**: Testing pomodoro timers, break countdowns, and focus session displays to ensure accurate time representation and user controls.

4. **Notification Systems**: Testing popup notifications, alert dialogs, and reminder components to ensure they display appropriate messages and respond to user dismissal.

## 🚀 Key Learning Outcomes

### React Testing Library Core Concepts Applied:

- **`render()`**: Renders React components into a virtual DOM for testing
- **`screen`**: Provides queries to find elements in the rendered component
- **`userEvent`**: Simulates realistic user interactions like clicks, typing, and form submissions
- **`getByTestId()`**: Finds elements by their `data-testid` attribute
- **`toHaveTextContent()`**: Asserts that an element contains specific text
- **`toBeInTheDocument()`**: Verifies that an element is present in the DOM

### Best Practices Demonstrated:

1. **Use `data-testid` for Reliable Queries**: Provides stable selectors that won't break due to UI changes
2. **Test User Behavior, Not Implementation**: Focus on what users see and do
3. **Async User Interactions**: Properly handle asynchronous user events
4. **Descriptive Test Names**: Clear test descriptions that explain the expected behavior

## 📝 Conclusion

This React component testing implementation successfully demonstrates how to test interactive UI components using Jest and React Testing Library. The approach emphasizes testing user behavior rather than implementation details, resulting in more maintainable and meaningful tests.

The integration of React Testing Library with our existing Jest setup provides a comprehensive testing foundation that can handle both utility functions and complex UI interactions. This is essential for maintaining the reliability and user experience of applications like Focus Bear, where UI responsiveness and accuracy are critical for user productivity.

The hands-on experience of configuring JSDOM, handling JSX compilation, and simulating user interactions provides practical knowledge that directly applies to testing real-world React applications with complex user workflows.

---

# Mocking API Calls in Jest - Advanced Testing Implementation #76

## 📖 Overview

Building upon our React component testing foundation, this implementation demonstrates how to mock API calls in Jest to test asynchronous code. This is crucial for testing components that interact with external APIs without making real network requests, ensuring tests are fast, reliable, and controllable.

## 🛠️ What We Updated in the Demo React Project

### 1. New UserProfile Component Implementation

We created a new React component that fetches user data from a public API and handles various states (loading, success, error).

**UserProfile Component (`src/UserProfile.tsx`):**

![UserProfile Component Code](jest-react-demo/screenshots/mock-api-calls/user-profile-code.png)

```typescript
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users/1"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div data-testid="loading">Loading user data...</div>;
  }

  if (error) {
    return <div data-testid="error">Error: {error}</div>;
  }

  if (!user) {
    return <div data-testid="no-data">No user data available</div>;
  }

  return (
    <div data-testid="user-profile">
      <h2>User Profile</h2>
      <div data-testid="user-name">Name: {user.name}</div>
      <div data-testid="user-email">Email: {user.email}</div>
      <div data-testid="user-phone">Phone: {user.phone}</div>
      <div data-testid="user-website">Website: {user.website}</div>
      <button data-testid="refresh-button" onClick={fetchUserData}>
        Refresh Data
      </button>
    </div>
  );
}
```

**Key Component Features:**

- **TypeScript Interface**: Defines the expected user data structure from the API
- **State Management**: Manages `user`, `loading`, and `error` states independently
- **API Integration**: Uses the JSONPlaceholder API for realistic testing scenarios
- **Error Handling**: Comprehensive error handling for network failures and HTTP errors
- **Refresh Functionality**: Allows users to manually refresh data
- **Test-Friendly Design**: Uses `data-testid` attributes for reliable test targeting

### 2. App Component Integration

**Updated App Component (`src/App.tsx`):**

```typescript
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
```

Added the new `UserProfile` component to demonstrate API mocking alongside existing component testing.

### 3. Comprehensive API Mocking Tests

**UserProfile Tests (`src/__test__/UserProfile.test.tsx`):**

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { UserProfile } from "../UserProfile";

// Mock the global fetch function
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

// Mock user data that matches the API response structure
const mockUserData = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  website: "johndoe.com",
};

describe("UserProfile Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    mockFetch.mockClear();
  });

  it("shows loading state initially", () => {
    // Setup: Mock fetch to return a pending promise (never resolves)
    mockFetch.mockImplementation(() => new Promise(() => {}));

    render(<UserProfile />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByTestId("loading")).toHaveTextContent(
      "Loading user data..."
    );
  });

  it("displays user data when API call succeeds", async () => {
    // Setup: Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    } as Response);

    render(<UserProfile />);

    // Initially shows loading
    expect(screen.getByTestId("loading")).toBeInTheDocument();

    // Wait for loading to finish and data to appear
    await waitFor(() => {
      expect(screen.getByTestId("user-profile")).toBeInTheDocument();
    });

    // Verify user data is displayed correctly
    expect(screen.getByTestId("user-name")).toHaveTextContent("Name: John Doe");
    expect(screen.getByTestId("user-email")).toHaveTextContent(
      "Email: john.doe@example.com"
    );
    expect(screen.getByTestId("user-phone")).toHaveTextContent(
      "Phone: 123-456-7890"
    );
    expect(screen.getByTestId("user-website")).toHaveTextContent(
      "Website: johndoe.com"
    );

    // Verify fetch was called with correct URL
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users/1"
    );
  });

  it("shows error message when API call fails", async () => {
    // Setup: Mock failed API response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    render(<UserProfile />);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    expect(screen.getByTestId("error")).toHaveTextContent(
      "Error: Failed to fetch user data"
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("shows error message when network request fails", async () => {
    // Setup: Mock network error
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<UserProfile />);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    expect(screen.getByTestId("error")).toHaveTextContent(
      "Error: Network error"
    );
  });

  it("can refresh data when refresh button is clicked", async () => {
    // Setup: Mock successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUserData,
    } as Response);

    render(<UserProfile />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByTestId("user-profile")).toBeInTheDocument();
    });

    // Click refresh button
    const refreshButton = screen.getByTestId("refresh-button");
    await userEvent.click(refreshButton);

    // Verify fetch was called twice (initial load + refresh)
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users/1"
    );
  });

  it("handles multiple rapid API calls correctly", async () => {
    // Setup: Mock successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUserData,
    } as Response);

    render(<UserProfile />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByTestId("user-profile")).toBeInTheDocument();
    });

    // Click refresh button
    const refreshButton = screen.getByTestId("refresh-button");
    await userEvent.click(refreshButton);

    // Should handle the refresh gracefully
    await waitFor(() => {
      expect(screen.getByTestId("user-profile")).toBeInTheDocument();
    });

    // Should have made API calls (initial + refresh)
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
```

## 🧪 Test Output

![API Mocking Test Output](jest-react-demo/screenshots/mock-api-calls/user-profile-test-output.png)

**Test Results:**

- ✅ 10 tests passed (2 math + 2 message button + 6 API mocking tests)
- ✅ 3 test suites passed
- ✅ All test scenarios covered successfully

## 🔧 Key API Mocking Concepts Implemented

### 1. Global Fetch Mocking

```typescript
// Mock the global fetch function
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;
```

**Purpose**: Replaces the browser's native `fetch` function with a controllable Jest mock function.

### 2. Mock Response Scenarios

**Successful Response:**

```typescript
mockFetch.mockResolvedValueOnce({
  ok: true,
  json: async () => mockUserData,
} as Response);
```

**HTTP Error Response:**

```typescript
mockFetch.mockResolvedValueOnce({
  ok: false,
  status: 404,
} as Response);
```

**Network Error:**

```typescript
mockFetch.mockRejectedValueOnce(new Error("Network error"));
```

**Pending/Loading State:**

```typescript
mockFetch.mockImplementation(() => new Promise(() => {}));
```

### 3. Test Cleanup and Isolation

```typescript
beforeEach(() => {
  mockFetch.mockClear();
});
```

Ensures each test starts with a clean mock state, preventing test interference.

### 4. Asynchronous Testing Patterns

```typescript
await waitFor(() => {
  expect(screen.getByTestId("user-profile")).toBeInTheDocument();
});
```

Uses `waitFor` to handle asynchronous operations and state updates properly.

## 💭 Reflection on API Mocking

### Why is it important to mock API calls in tests?

1. **Speed and Performance**: Mocked API calls execute instantly, making tests run much faster than real network requests. This is crucial for maintaining fast feedback loops during development.

2. **Reliability and Determinism**: Tests don't depend on external services, network conditions, or API availability. Mocked tests produce consistent results regardless of external factors.

3. **Cost and Rate Limiting**: Avoids hitting API rate limits or incurring costs from paid APIs during testing. This is particularly important in CI/CD pipelines that run tests frequently.

4. **Isolation and Focus**: Tests focus on the component's behavior rather than the API's functionality. We're testing our code's logic, not the external service.

5. **Error Scenario Testing**: Easy to simulate various error conditions (network failures, HTTP errors, timeouts) that would be difficult or impossible to reproduce with real APIs.

6. **Offline Development**: Developers can run tests without internet connectivity, enabling productive development in any environment.

### What are some common pitfalls when testing asynchronous code?

1. **Race Conditions**: Forgetting to use `await` or `waitFor()` can lead to assertions running before asynchronous operations complete, causing flaky tests.

   **Example Pitfall:**

   ```typescript
   // ❌ Wrong - assertion runs immediately
   render(<UserProfile />);
   expect(screen.getByTestId("user-profile")).toBeInTheDocument();

   // ✅ Correct - wait for async operation
   render(<UserProfile />);
   await waitFor(() => {
     expect(screen.getByTestId("user-profile")).toBeInTheDocument();
   });
   ```

2. **Mock State Pollution**: Not clearing mocks between tests can cause previous test configurations to affect subsequent tests, leading to unpredictable results.

   **Solution:**

   ```typescript
   beforeEach(() => {
     mockFetch.mockClear(); // Reset mock call history
   });
   ```

3. **Incomplete Response Mocking**: Forgetting to mock all parts of the Response object (like the `json()` method) can cause runtime errors in tests.

   **Example:**

   ```typescript
   // ❌ Incomplete mock
   mockFetch.mockResolvedValueOnce({ ok: true } as Response);

   // ✅ Complete mock
   mockFetch.mockResolvedValueOnce({
     ok: true,
     json: async () => mockUserData,
   } as Response);
   ```

4. **Timing Issues**: Not accounting for React's batching of state updates or useEffect timing can lead to assertions that run too early.

5. **Over-Mocking**: Mocking too much internal implementation instead of focusing on the external API boundary can make tests brittle and less meaningful.

### Focus Bear Application Context

In the context of Focus Bear's development, API mocking becomes essential for:

1. **Authentication Testing**: Mock login/logout API calls to test user authentication flows without requiring real credentials or external auth services.

2. **User Settings API**: Test settings synchronization across devices by mocking the settings API to verify that UI updates correctly reflect server responses.

3. **Analytics Integration**: Mock analytics API calls to test event tracking without sending test data to production analytics systems.

4. **Habit Tracking Data**: Test habit completion, streak calculations, and progress updates by mocking the habit tracking API with various data scenarios.

5. **Timer Synchronization**: Mock timer state synchronization APIs to test that focus sessions and breaks maintain consistency across browser sessions.

6. **Error Handling**: Test how the app handles network failures, server errors, and API rate limiting to ensure graceful degradation of functionality.

## 🚀 Advanced Testing Patterns Demonstrated

### 1. Multiple Mock Strategies

- **`mockResolvedValueOnce()`**: For single-use mock responses
- **`mockResolvedValue()`**: For reusable mock responses across multiple calls
- **`mockRejectedValueOnce()`**: For simulating promise rejections
- **`mockImplementation()`**: For custom mock logic and pending promises

### 2. Comprehensive State Testing

- **Loading State**: Testing initial loading indicators
- **Success State**: Verifying correct data display and UI updates
- **Error States**: Testing both HTTP errors and network failures
- **User Interactions**: Testing refresh functionality and multiple API calls

### 3. API Contract Verification

```typescript
expect(mockFetch).toHaveBeenCalledWith(
  "https://jsonplaceholder.typicode.com/users/1"
);
```

Ensures components call APIs with correct URLs and parameters.

### 4. Call Count Verification

```typescript
expect(mockFetch).toHaveBeenCalledTimes(2);
```

Verifies expected number of API calls, crucial for testing refresh functionality and preventing unnecessary network requests.

## 📝 Conclusion

This API mocking implementation successfully demonstrates advanced Jest testing techniques for asynchronous React components. The comprehensive test coverage includes all common scenarios: loading states, successful data fetching, error handling, and user interactions.

The implementation showcases industry best practices for testing components that integrate with external APIs, ensuring that tests are fast, reliable, and maintainable. The mocking strategies demonstrated here directly apply to real-world applications like Focus Bear, where reliable API integration testing is crucial for user experience and application stability.

The hands-on experience with Jest mocking functions, async testing patterns, and comprehensive error scenario coverage provides essential skills for developing robust, well-tested React applications that gracefully handle the complexities of modern web API integrations.

---
