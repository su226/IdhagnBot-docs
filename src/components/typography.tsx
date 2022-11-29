import { Tooltip } from "@mui/material";
import React from "react";
import classes from "./typography.module.css";

interface AbbrProps {
  title: React.ReactNode
  children: React.ReactNode
}

export function Abbr(props: AbbrProps) {
  return (
    <Tooltip title={props.title}>
      <abbr className={classes.Abbr}>
        {props.children}
      </abbr>
    </Tooltip>
  );
}

interface RubyProps {
  rt: React.ReactNode
  children: React.ReactNode
}

export function Ruby(props: RubyProps) {
  return (
    <ruby>
      {props.children}
      <rp>（</rp>
      <rt>{props.rt}</rt>
      <rp>）</rp>
    </ruby>
  );
}

const FACES = {
  277: "汪汪"
}

interface FaceProps {
  id: keyof typeof FACES
}

export function Face(props: FaceProps) {
  return (
    <img
      className="face"
      src={`/face/${props.id}.png`}
      alt={`[${FACES[props.id]}]`}
    />
  );
}

interface PlaceholderLinkProps {
  href?: string,
  children?: JSX.Element[]
}

export function PlaceholderLink(props: PlaceholderLinkProps): JSX.Element {
  const title = props.href ? `${props.href} 未完成` : "文档未完成";
  return (
    <Tooltip title={title}>
      <a className={classes.PlaceholderLink}>
        {props.children}
      </a>
    </Tooltip>
  );
}
