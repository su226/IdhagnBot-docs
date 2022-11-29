import { Collapsible } from "@docusaurus/theme-common";
import { mdiCheck, mdiContentCopy, mdiMinus, mdiPlus } from "@mdi/js";
import { Button, Paper, Tooltip, Typography } from "@mui/material";
import clsx from "clsx";
import React from "react";
import { useExpandAll } from "./CollapseGroup";
import classes from "./Example.module.css";
import copyTextToClipboard from "copy-text-to-clipboard";
import MdiIcon from "./MdiIcon";
import ShrinkIcons from "./ShrinkIcons";

interface ExampleProps {
  collapsed?: boolean
  children?: JSX.Element[]
}

export default function Example(props: ExampleProps): JSX.Element {
  const [expanded, setExpanded] = React.useState(!props.collapsed);
  useExpandAll(setExpanded);

  const [first, ...rest] = props.children;
  return (
    <Paper className={classes.Example} variant="outlined">
      <div className={classes.ExampleHeader}>
        {first}
        <div className={classes.ExampleButtons}>
          <Typography variant="overline">示例</Typography>
          <Tooltip title={expanded ? "收起" : "展开"} placement="left">
            <Button onClick={() => setExpanded(!expanded)}>
              <ShrinkIcons flip={expanded}>
                <MdiIcon path={mdiPlus} />
                <MdiIcon path={mdiMinus} />
              </ShrinkIcons>
            </Button>
          </Tooltip>
        </div>
      </div>
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
  children: React.ReactNode
}

function Message(props: MessageProps): JSX.Element {
  const contentRef = React.useRef<HTMLDivElement>();
  const timeoutRef = React.useRef(-1);
  const [copied, setCopied] = React.useState(false);
  const type = props.type ?? "send";
  const prefixClass = type == "send" ? classes.MessagePrefixSend : classes.MessagePrefixRecv;
  function copyContent() {
    copyTextToClipboard(contentRef.current.textContent);
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1000);
  }
  return (
    <div className={classes.Message}>
      <div className={clsx(classes.MessagePrefix, prefixClass)}>
        <Tooltip title={copied ? "已复制" : "复制（只能复制文本）"} placement="right">
          <Button className={classes.MessageCopy} onClick={copyContent}>
            <ShrinkIcons flip={copied}>
              <MdiIcon path={mdiContentCopy} />
              <MdiIcon path={mdiCheck} />
            </ShrinkIcons>
          </Button>
        </Tooltip>
      </div>
      <div className={clsx(classes.MessageBlock, classes.MessageContent, props.mono && "monospace")} ref={contentRef}>
        {props.children}
      </div>
    </div>
  );
}

interface SendRecvProps {
  mono?: boolean
  children: React.ReactNode
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
  return (
    <div className={classes.Note}>
      <div className={classes.MessageContent}>
        {props.children}
      </div>
    </div>
  );
}

export function Name(props: NoteProps): JSX.Element {
  return (
    <div className={clsx(classes.Name, classes.MessageContent)}>
      {props.children}
    </div>
  );
}
