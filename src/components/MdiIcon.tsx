import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

interface MdiIconProps extends SvgIconProps {
  path: string
}

export default function MdiIcon(props: MdiIconProps) {
  const {path, ...rest} = props;
  return <SvgIcon {...rest}><path d={path} /></SvgIcon>;
}
