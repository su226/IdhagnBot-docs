import React from "react";
import ReactDOM from "react-dom";
import { usePopper } from 'react-popper';
import classes from "./PlaceholderLink.module.css";

const SHOW_EVENTS = ["mouseenter", "focus"];
const HIDE_EVENTS = ["mouseleave", "blur"];

interface PlaceholderLinkProps {
  href?: string,
  children?: JSX.Element[]
}

export default function PlaceholderLink(props: PlaceholderLinkProps): JSX.Element {
  const [refEl, setRefEl] = React.useState<HTMLElement | null>(null);
  const [popEl, setPopEl] = React.useState<HTMLElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const show = () => setOpen(true);
  const hide = () => setOpen(false);
  const {styles, attributes} = usePopper(refEl, popEl);

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

  const title = props.href ? `${props.href} 未完成` : "文档未完成";
  return (
    <>
      <a ref={setRefEl} className={classes.placeholder} href="#!">
        {props.children}
      </a>
      {open && ReactDOM.createPortal(
        <div ref={setPopEl} className={classes.placeholderTooltip} style={styles.popper} {...attributes.popper}>
          {title}
        </div>
      , document.body)}
    </>
  );
}
