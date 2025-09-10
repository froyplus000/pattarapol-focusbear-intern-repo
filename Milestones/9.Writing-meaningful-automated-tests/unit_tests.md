# Unit Testing with Jest - Documentation and Reflection

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
