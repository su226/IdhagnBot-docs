import { Collapsible } from "@docusaurus/theme-common";
import { mdiCheck, mdiContentCopy, mdiMinus, mdiPlus } from "@mdi/js";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import React from "react";
import { useExpandAll } from "./CollapseGroup";
import classes from "./Example.module.css";
import { MdiIcon, copy } from "./common";
import ShrinkIcons from "./ShrinkIcons";

interface ExampleProps {
  collapsed?: boolean
  children?: JSX.Element[]
}

export default function Example(props: ExampleProps): JSX.Element {
  const [expanded, setExpanded] = React.useState(!props.collapsed);
  useExpandAll(setExpanded);

  const [firstOrig, ...rest] = props.children;
  const first = React.cloneElement(firstOrig, {
    button: (
      <>
        <Typography variant="overline">示例</Typography>
        <Tooltip title={expanded ? "收起" : "展开"} placement="left">
          <Button onClick={() => setExpanded(!expanded)}>
            <ShrinkIcons flip={expanded}>
              <MdiIcon path={mdiPlus} />
              <MdiIcon path={mdiMinus} />
            </ShrinkIcons>
          </Button>
        </Tooltip>
      </>
    )
  })
  return (
    <Paper className={classes.Example} variant="outlined">
      {first}
      <Collapsible className={classes.MessageGroup} lazy collapsed={!expanded}>
        {rest}
      </Collapsible>
    </Paper>
  );
}

export function Forward(props: ExampleProps) {
  const [expanded, setExpanded] = React.useState(!props.collapsed);
  useExpandAll(setExpanded);

  return (
    <Paper variant="outlined">
      <Button
        fullWidth
        onClick={() => setExpanded(!expanded)}
        endIcon={
          <ShrinkIcons flip={expanded}>
            <MdiIcon path={mdiPlus} />
            <MdiIcon path={mdiMinus} />
          </ShrinkIcons>
        }
      >
        合并转发
      </Button>
      <Collapsible className={classes.MessageGroup} lazy collapsed={!expanded}>
        {props.children}
      </Collapsible>
    </Paper>
  );
}

interface MessageProps {
  type?: "send" | "recv"
  mono?: boolean
  button?: JSX.Element
  children: any
}

function Message(props: MessageProps): JSX.Element {
  const contentRef = React.useRef<HTMLDivElement>();
  const timeoutRef = React.useRef(-1);
  const [copied, setCopied] = React.useState(false);
  const type = props.type ?? "send";
  const prefixClass = type == "send" ? classes.MessagePrefixSend : classes.MessagePrefixRecv;
  function copyContent() {
    copy(contentRef.current.textContent);
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1000);
  }
  return (
    <div className={classes.Message}>
      <div className={clsx(classes.MessagePrefix, prefixClass)}>
        <Tooltip title={copied ? "已复制" : "复制"} placement="right">
          <Button className={classes.MessageCopy} onClick={copyContent}>
            <ShrinkIcons flip={copied}>
              <MdiIcon path={mdiContentCopy} />
              <MdiIcon path={mdiCheck} />
            </ShrinkIcons>
          </Button>
        </Tooltip>
      </div>
      <div className={clsx(classes.MessageContent, props.mono && "monospace")} ref={contentRef}>
        {props.children}
      </div>
      {props.button &&
        <div className={classes.MessageButton}>
          {props.button}
        </div>
      }
    </div>
  );
}

interface SendRecvProps {
  mono?: boolean
  children: JSX.Element[]
}

export function Send(props: SendRecvProps): JSX.Element {
  return <Message type="send" {...props} />;
}

export function Recv(props: SendRecvProps): JSX.Element {
  return <Message type="recv" {...props} />;
}

interface NoteProps {
  children: JSX.Element[]
}

export function Note(props: NoteProps): JSX.Element {
  return <div className={classes.Note}>{props.children}</div>;
}
