import React from "react";
import ReactDOM from "react-dom";
import { usePopper } from 'react-popper';
import classes from "./Tooltip.module.css";

const SHOW_EVENTS = ["mouseenter", "focus"];
const HIDE_EVENTS = ["mouseleave", "blur"];

interface TooltipProps {
  tooltip: JSX.Element | string,
  children?: JSX.Element
}

type AnyMutableRef<T> = React.MutableRefObject<T> | React.RefCallback<T>;

function forkRef<T>(...refs: (AnyMutableRef<T> | null)[]): React.RefCallback<T> {
  return value => refs.forEach(ref => {
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
  });
}

export default function PlaceholderLink(props: TooltipProps): JSX.Element {
  const [refEl, setRefEl] = React.useState<HTMLElement | null>(null);
  const [popEl, setPopEl] = React.useState<HTMLElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const show = () => setOpen(true);
  const hide = () => setOpen(false);
  const {styles, attributes, update} = usePopper(refEl, popEl, {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 14],
        },
      },
    ],
  });

  React.useEffect(() => {
    if (refEl) {
      SHOW_EVENTS.forEach(e => refEl.addEventListener(e, show));
      HIDE_EVENTS.forEach(e => refEl.addEventListener(e, hide));
    }
    return () => {
      if (refEl) {
        SHOW_EVENTS.forEach(e => refEl.removeEventListener(e, show));
        HIDE_EVENTS.forEach(e => refEl.removeEventListener(e, hide));
      }
    };
  }, [refEl]);

  React.useEffect(() => {
    update?.();
  }, [props.tooltip]);

  // 这个用法是从 Material-UI 的 Tooltip 学的
  const childProps = {
    ...props.children.props,
    ref: forkRef(props.children.props.ref, setRefEl)
  };

  return (
    <>
      {React.cloneElement(props.children, childProps)}
      {open && ReactDOM.createPortal(
        <div ref={setPopEl} className={classes.tooltip} style={styles.popper} {...attributes.popper}>
          {props.tooltip}
        </div>
      , document.body)}
    </>
  );
}
