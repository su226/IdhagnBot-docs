import clsx from "clsx";
import React from "react";
import classes from "./ShrinkIcons.module.css";

interface ShrinkIconsProps {
  flip?: boolean
  children: [JSX.Element, JSX.Element]
}

export default function ShrinkIcons(props: ShrinkIconsProps): JSX.Element {
  const [firstOrig, secondOrig] = props.children;
  const first = React.cloneElement(firstOrig, {
    className: clsx(firstOrig.props.className, classes.IconA)
  });
  const second = React.cloneElement(secondOrig, {
    className: clsx(secondOrig.props.className, classes.IconB)
  });
  return (
    <div className={clsx(classes.ShrinkIcons, props.flip && classes.Flip)}>
      {first}
      {second}
    </div>
  );
}
