import { PropsWithChildren } from "react";

export interface ICenteredComponentProps {}

export const CenteredComponent = (
  props: PropsWithChildren<ICenteredComponentProps>
) => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flexGrow: 0.5 }} />
      {props.children}
      <div style={{ flexGrow: 0.5 }} />
    </div>
  );
};
