import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConnectedShoppingList } from "../../components/connected-shopping-list";

vi.mock("@/client/generated/hooks", () => ({
  useGetMiseShoppingListActive: vi.fn(),
}));

import { useGetMiseShoppingListActive } from "@/client/generated/hooks";

const items = [
  { ingredient: "Bananas", quantities: [{ unit: "quantity", value: 6 }], category: "Fresh Fruit & Vegetables", meals: ["Smoothie"] },
  { ingredient: "Milk", quantities: [{ unit: "millilitre", value: 500 }], category: "Dairy & Eggs", meals: ["Cereal"] },
  { ingredient: "Toothpaste", quantities: [{ unit: "none" }], category: "Toiletries", meals: [] },
];

function mockList(overrides: Partial<{ items: typeof items; generatedAt: number | null }> = {}) {
  vi.mocked(useGetMiseShoppingListActive).mockReturnValue({
    data: {
      items: overrides.items ?? items,
      generatedAt: "generatedAt" in overrides ? overrides.generatedAt! : Date.now(),
    },
    isLoading: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
}

describe("ConnectedShoppingList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("shows an empty state when no list has been generated", () => {
    mockList({ generatedAt: null, items: [] });
    render(<ConnectedShoppingList />);
    expect(screen.getByText(/no shopping list yet/i)).toBeTruthy();
  });

  it("renders all ingredients", () => {
    mockList();
    render(<ConnectedShoppingList />);
    expect(screen.getByText("Bananas")).toBeTruthy();
    expect(screen.getByText("Milk")).toBeTruthy();
    expect(screen.getByText("Toothpaste")).toBeTruthy();
  });

  it("filters by ingredient name via search", async () => {
    vi.useFakeTimers();
    mockList();
    render(<ConnectedShoppingList />);
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "milk" },
    });
    vi.advanceTimersByTime(500);
    vi.useRealTimers();

    expect(await screen.findByText("Milk")).toBeTruthy();
    expect(screen.queryByText("Bananas")).toBeNull();
  });

  it("filters by category chip", () => {
    mockList();
    render(<ConnectedShoppingList />);
    fireEvent.click(screen.getByText("Toiletries"));
    expect(screen.getByText("Toothpaste")).toBeTruthy();
    expect(screen.queryByText("Bananas")).toBeNull();
    expect(screen.queryByText("Milk")).toBeNull();
  });

  it("sends a checked item to the bottom of the list", () => {
    mockList();
    render(<ConnectedShoppingList />);

    const getOrder = () =>
      screen.getAllByRole("checkbox").map((el) =>
        el.closest("li")?.textContent
      );

    fireEvent.click(screen.getAllByRole("checkbox")[0]);

    const order = getOrder();
    const bananasIndex = order.findIndex((t) => t?.includes("Bananas"));
    expect(bananasIndex).toBe(order.length - 1);
  });
});
