import React from "react";
import classes from "./PlaceholderLink.module.css";
import Tooltip from "./Tooltip";

interface PlaceholderLinkProps {
  href?: string,
  children?: JSX.Element[]
}

export default function PlaceholderLink(props: PlaceholderLinkProps): JSX.Element {
  const title = props.href ? `${props.href} 未完成` : "文档未完成";
  return (
    <Tooltip tooltip={title}>
      <a className={classes.placeholder} href="#!">
        {props.children}
      </a>
    </Tooltip>
  );
}
