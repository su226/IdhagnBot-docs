import React from "react";

export interface ExpandAllType {
  value: boolean,
  time: number
}

export const ExpandAll = React.createContext<ExpandAllType>({value: false, time: 0});
ExpandAll.displayName = "ExpandAll";

export function useExpandAll(callback: (expanded: boolean) => void): void {
  const value = React.useContext(ExpandAll);
  React.useEffect(() => {
    if (value.time != 0) {
      callback(value.value);
    }
  }, [value.time]);
}

export interface CollapseGroupProps {
  children?: JSX.Element[]
  title?: string | JSX.Element
}

export default function CollapseGroup(props: CollapseGroupProps): JSX.Element {
  const [expandAll, setExpandAll] = React.useState({value: false, time: 0});
  function expand() {
    setExpandAll({value: true, time: Date.now()});
  }
  function collapse() {
    setExpandAll({value: false, time: Date.now()});
  }
  return (
    <ExpandAll.Provider value={expandAll}>
      <p>
        <button className="button button--primary" onClick={expand}>全部展开</button>
        {" "}
        <button className="button button--secondary" onClick={collapse}>全部收起</button>
        {" "}
        {props.title}
      </p>
      {props.children}
    </ExpandAll.Provider>
  );
}

function chunked<T>(list: T[], n: number): T[][] {
  const chunks: T[][] = [];
  let chunk: T[] = [];
  for (const item of list) {
    chunk.push(item);
    if (chunk.length === n) {
      chunks.push(chunk);
      chunk = [];
    }
  }
  if (chunk.length > 0) {
    chunks.push(chunk);
  }
  return chunks;
}

export interface CollapseAutoGroupProps {
  children?: JSX.Element[]
  every?: number
}

export function CollapseAutoGroup(props: CollapseAutoGroupProps): JSX.Element[] {
  const every = props.every || 10;
  return chunked(props.children, every).map((chunk, i) => 
    <CollapseGroup key={i} title={`${every * i + 1} - ${every * i + chunk.length}`}>
      {chunk}
    </CollapseGroup>
  );
}
