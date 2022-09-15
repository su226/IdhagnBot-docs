import { Collapsible } from "@docusaurus/theme-common";
import { mdiCheck, mdiContentCopy, mdiMinus, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import React from "react";
import { useExpandAll } from "./CollapseGroup";
import classes from "./Example.module.css";
import Tooltip from "./Tooltip";

interface ExampleProps {
  input: string,
  collapsed?: boolean,
  children?: JSX.Element[]
}

export default function Example(props: ExampleProps): JSX.Element {
  const [collapsed, setCollapsed] = React.useState(props.collapsed ?? false);
  useExpandAll(expanded => setCollapsed(!expanded));

  const command = "/" + props.input;
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<number>(-1);
  function copy() {
    const elem = document.createElement("textarea");
    elem.value = command;
    document.body.append(elem);
    elem.select();
    document.execCommand("Copy");
    elem.remove();
    setCopied(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  return (
    <div className={clsx("card", classes.example)}>
      <div className={classes.exampleHeader}>
        <Tooltip tooltip={copied ? "已复制" : "复制命令"}>
          <div className={classes.exampleButton} role="button" onClick={copy}>
            <Icon path={copied ? mdiCheck : mdiContentCopy} />
          </div>
        </Tooltip>
        <div className="card__header">
          {command}
        </div>
        <Tooltip tooltip={collapsed ? "展开" : "收起"}>
          <div className={classes.exampleButton} role="button" onClick={() => setCollapsed(!collapsed)}>
            <Icon path={collapsed ? mdiPlus : mdiMinus} />
          </div>
        </Tooltip>
      </div>
      <Collapsible collapsed={collapsed} lazy>
        <div className="card__body">
          {props.children}
        </div>
      </Collapsible>
    </div>
  );
}
