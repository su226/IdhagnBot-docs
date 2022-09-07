import { Collapsible } from "@docusaurus/theme-common";
import { mdiMinus, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import React from "react";
import classes from "./Example.module.css";

interface ExpandAllType {
  value: boolean,
  time: number
}

const ExpandAll = React.createContext({value: false, time: 0});

interface WithExpandAll {
  expandAll: ExpandAllType
}

interface ExampleGroupProps {
  children?: JSX.Element[]
}

export function ExampleGroup(props: ExampleGroupProps): JSX.Element {
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
        <button className="button button--primary" onClick={expand}>全部展开</button> <button className="button button--secondary" onClick={collapse}>全部收起</button>
      </p>
      {props.children}
    </ExpandAll.Provider>
  );
}

interface ExampleProps {
  input: string,
  collapsed?: boolean,
  children?: JSX.Element[]
}

function ExampleInner(props: ExampleProps & WithExpandAll): JSX.Element {
  const [collapsed, setCollapsed] = React.useState(props.collapsed ?? false);
  const lastTime = React.useRef(0);
  if (lastTime.current < props.expandAll.time) {
    setCollapsed(!props.expandAll.value);
    lastTime.current = props.expandAll.time;
  }
  return (
    <div className={clsx("card", classes.example)}>
      <div className={classes.exampleHeader}>
        <div className="card__header">
          /{props.input}
        </div>
        <div className={classes.exampleToggle} role="button" onClick={() => setCollapsed(!collapsed)}>
          <Icon path={collapsed ? mdiPlus : mdiMinus} />
        </div>
      </div>
      <Collapsible collapsed={collapsed} lazy>
        <div className="card__body">
          {props.children}
        </div>
      </Collapsible>
    </div>
  );
}

export default function Example(props: ExampleProps): JSX.Element {
  return (
    <ExpandAll.Consumer>
      {value => <ExampleInner expandAll={value} {...props} />}
    </ExpandAll.Consumer>
  );
}
