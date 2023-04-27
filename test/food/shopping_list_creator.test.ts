import { createShoppingListData } from "../../components/pages/food/meal_planner/shopping_list_creator";
import { IRecipe, Unit } from "../../core/types/recipes";

const recipes: IRecipe[] = [
  {
    uuid: "1",
    name: "Recipe 1",
    description: "",
    images: [],
    components: [
      {
        name: "Component 1",
        uuid: "2",
        instructions: [],
        ingredients: [
          {
            name: "Chicken",
            quantity: {
              unit: Unit.GRAM,
              value: 200,
            },
          },
        ],
      },
    ],
  },
  {
    uuid: "10",
    name: "Recipe 2",
    description: "",
    images: [],
    components: [
      {
        name: "Component 2",
        uuid: "4",
        instructions: [],
        ingredients: [
          {
            name: "Chicken",
            quantity: {
              unit: Unit.KILOGRAM,
              value: 1,
            },
          },
        ],
      },
    ],
  },
  {
    uuid: "100",
    name: "Recipe 3",
    description: "",
    images: [],
    components: [
      {
        name: "Component 3",
        uuid: "8",
        instructions: [],
        ingredients: [
          {
            name: "Chicken",
            quantity: {
              unit: Unit.GRAM,
              value: 300,
            },
          },
          {
            name: "Other",
            quantity: {
              unit: Unit.GRAM,
              value: 100,
            },
          },
        ],
      },
    ],
  },
];

test("", () => {
  expect(
    createShoppingListData(
      recipes,
      {
        Day1: { "1": [{ componentId: "2", servings: 1 }] },
        Day2: { "10": [{ componentId: "4", servings: 1 }] },
        Day3: { "100": [{ componentId: "8", servings: 1 }] },
      },
      new Set(["Day1", "Day2", "Day3"])
    )
  ).toStrictEqual({
    Chicken: {
      meals: new Set(["Recipe 1", "Recipe 2", "Recipe 3"]),
      quantities: [
        { unit: Unit.GRAM, value: 500 },
        { unit: Unit.KILOGRAM, value: 1 },
      ],
    },
    Other: {
      meals: new Set(["Recipe 3"]),
      quantities: [{ unit: Unit.GRAM, value: 100 }],
    },
  });
});
