import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import React from "react";

export function copy(text: string) {
  const elem = document.createElement("textarea");
  elem.value = text;
  document.body.append(elem);
  elem.select();
  document.execCommand("Copy");
  elem.remove();
}

interface MdiIconProps extends SvgIconProps {
  path: string
}

export function MdiIcon(props: MdiIconProps) {
  const {path, ...rest} = props;
  return <SvgIcon {...rest}><path d={path} /></SvgIcon>;
}
