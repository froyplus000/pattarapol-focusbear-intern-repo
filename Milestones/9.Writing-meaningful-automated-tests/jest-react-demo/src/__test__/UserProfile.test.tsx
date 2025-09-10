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
