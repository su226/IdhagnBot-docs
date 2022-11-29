import { Collapsible } from "@docusaurus/theme-common";
import { mdiMinus, mdiPlus } from "@mdi/js";
import { Button, Paper, Tooltip, Typography } from "@mui/material";
import clsx from "clsx";
import React from "react";
import { useExpandAll } from "./CollapseGroup";
import classes from "./Command.module.css";
import MdiIcon from "./MdiIcon";
import ShrinkIcons from "./ShrinkIcons";

interface CommandProps {
  name: string | string[],
  brief: string,
  perm: string,
  level?: "admin" | "owner" | "super"
  collapsed?: boolean,
  mono?: boolean,
  children?: React.ReactNode,
  group?: boolean
}

const LEVEL_NAMES = {
  "admin": "群管理员",
  "owner": "群主",
  "super": "超级管理员",
};

export default function Command(props: CommandProps): JSX.Element {
  const [expanded, setExpanded] = React.useState(!props.collapsed);
  useExpandAll(setExpanded);
  const [name, ...aliases] = typeof props.name === "string" ? [props.name] : props.name;

  return (
    <Paper className={classes.Command} variant="outlined">
      <div className={classes.CommandHeader}>
        <div className={classes.CommandTitle}>
          <code>/{name}</code>
          <span className={classes.CommandBrief}>{props.brief}</span>
        </div>
        <div className={classes.CommandButtons}>
          <Typography variant="overline">
            命令
          </Typography>
          <Tooltip title={expanded ? "收起" : "展开"} placement="left">
            <Button onClick={() => setExpanded(!expanded)}>
              <ShrinkIcons flip={expanded}>
                <MdiIcon className={classes.IconA} path={mdiPlus} />
                <MdiIcon className={classes.IconB} path={mdiMinus} />
              </ShrinkIcons>
            </Button>
          </Tooltip>
        </div>
      </div>
      <Collapsible collapsed={!expanded} lazy>
        <div className={clsx(classes.CommandUsage, props.mono && "monospace")}>
          {props.children}
        </div>
        <div className={classes.CommandInfo}>
          {aliases.length > 0 &&
            <>
              {"别名 "}
              {aliases.map((n, i) =>
                <React.Fragment key={n}>
                  {i != 0 && "、"}
                  <code>/{n}</code>
                </React.Fragment>)
              }
              <br />
            </>
          }
          权限节点 <code>{props.perm}</code>
          {props.level &&
            <>
              <br />
              {"默认权限等级 "}
              <code>{props.level}</code>
              {" " + LEVEL_NAMES[props.level]}
            </>
          }
          {props.group &&
            <>
              <br />
              必须在群聊上下文中执行
            </>
          }
        </div>
      </Collapsible>
    </Paper>
  );
}
