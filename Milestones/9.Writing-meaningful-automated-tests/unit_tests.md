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
