export type WithDefined<Obj, Keys extends keyof Obj> = {
  [key in keyof Omit<Obj, Keys>]: Obj[key];
} & { [key in Keys]: NonNullable<Obj[key]> };

interface Flavoring<FlavorT> {
  _type?: FlavorT;
}
export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;