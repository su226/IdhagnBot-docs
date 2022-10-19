import { Collapsible } from "@docusaurus/theme-common";
import { mdiMinus, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import React from "react";
import { useExpandAll } from "./CollapseGroup";
import classes from "./Example.module.css";
import Tooltip from "@mui/material/Tooltip";

interface CommandProps {
  name: string | string[],
  brief: string,
  perm: string,
  collapsed?: boolean,
  children?: JSX.Element[]
}

export default function Command(props: CommandProps): JSX.Element {
  const [collapsed, setCollapsed] = React.useState(props.collapsed ?? false);
  useExpandAll(expanded => setCollapsed(!expanded));

  const [name, ...aliases] = typeof props.name === "string" ? [props.name] : props.name;
  const brief = props.brief ? ` - ${props.brief}` : "";
  return (
    <div className={clsx("card", classes.example)}>
      <div className={classes.exampleHeader}>
        <div className="card__header">
          <code>/{name}</code>{brief}
        </div>
        <Tooltip title={collapsed ? "展开" : "收起"}>
          <div className={classes.exampleButton} role="button" onClick={() => setCollapsed(!collapsed)}>
            <Icon path={collapsed ? mdiPlus : mdiMinus} />
          </div>
        </Tooltip>
      </div>
      <Collapsible collapsed={collapsed} lazy>
        <div className="card__body">
          {props.children}
        </div>
        <div className="card__footer">
          {aliases.length > 0 && <>
            {"别名: "}
            {aliases.map((n, i) => <React.Fragment key={n}>
              {i != 0 && "、"}
              <code>/{n}</code>
            </React.Fragment>)}
            <br />
          </>}
          权限节点: <code>{props.perm}</code>
        </div>
      </Collapsible>
    </div>
  );
}
