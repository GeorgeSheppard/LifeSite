export type WithDefined<Obj, Keys extends keyof Obj> = {
  [key in keyof Omit<Obj, Keys>]: Obj[key];
} & { [key in Keys]: NonNullable<Obj[key]> };

interface Flavoring<FlavorT> {
  _type?: FlavorT;
}
export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

export type Shared = Flavor<string, "Shared">
/**
 * We restrict certain calls so that the "shared" user cannot make modifications
 * to the database
 */
export type RealUserId = Flavor<string, "UserId">
export type UserId = RealUserId | Shared