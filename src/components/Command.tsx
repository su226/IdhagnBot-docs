import clsx from "clsx";
import React from "react";
import classes from "./Command.module.css";

interface CommandProps {
  name: string | string[],
  brief: string,
  children?: JSX.Element[],
  perm: string
}

export default function Command(props: CommandProps): JSX.Element {
  const [name, ...aliases] = typeof props.name === "string" ? [props.name] : props.name;
  return (
    <div className={clsx("card", classes.command)}>
      <div className="card__header">
        <code>/{name}</code> - {props.brief}
      </div>
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
    </div>
  );
}
