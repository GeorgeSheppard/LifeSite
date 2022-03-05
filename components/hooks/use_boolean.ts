import * as React from "react";

export type IUseBoolean = [state: boolean, callbacks: IUseBooleanCallbacks];

export interface IUseBooleanCallbacks {
  setState: (state: boolean) => void;
  turnOn: () => void;
  turnOff: () => void;
  toggle: () => void;
}

/**
 * Hook to simplify the boilerplate of creating a performant boolean state
 * in a functional component.\
 *
 * Explanation:\
 *  Not using this you would do
 * ```tsx
 *      const [boolean, setBoolean] = React.useState(true);
 * ```
 *  And when you want a button to set it to false you would at first try do
 * ```tsx
 *      <Button
 *          onClick={() => setBoolean(false)}
 *      />
 * ```
 *  This is bad as it binds a new function on each re-render, so the button will re-render
 *  whenever the parent does even though it doesn't need to.\
 *
 *  To improve you would do
 * ```tsx
 *      const [boolean, setBoolean] = React.useState(true);
 *      const buttonOnClick = React.useCallback(
 *          () => setBoolean(false),
 *          [setBoolean]
 *      );
 *      <Button
 *          onClick={buttonOnClick}
 *      />
 * ```
 *  And now you can see why this hook is used, setting boolean to false requires a callback,
 *  then one for true, then one if you want toggle behaviour. This hook returns all of these
 *  options already wrapped in useCallback so they can be passed safely down the component
 *  tree.
 */
export const useBoolean = (startState: boolean): IUseBoolean => {
  const [state, setState] = React.useState(startState);

  const turnOn = React.useCallback(() => {
    setState(true);
  }, []);

  const turnOff = React.useCallback(() => {
    setState(false);
  }, []);

  const toggle = React.useCallback(() => {
    setState(!state);
  }, [state]);

  const returnArray: IUseBoolean = React.useMemo(() => {
    return [state, { setState, turnOn, turnOff, toggle }];
  }, [state, turnOn, turnOff, toggle]);

  return returnArray;
};
