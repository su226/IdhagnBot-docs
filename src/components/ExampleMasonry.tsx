import { mdiCheck, mdiClose, mdiContentCopy } from "@mdi/js";
import { Masonry } from "@mui/lab";
import { Button, ButtonBase, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import copyTextToClipboard from "copy-text-to-clipboard";
import React from "react";
import MdiIcon from "./MdiIcon";
import classes from "./ExampleMasonry.module.css";
import ShrinkIcons from "./ShrinkIcons";

interface ExampleMasonryData {
  name: string[]
  brief?: string
  perm: string
  example: string
  image: string
  usage: string
}

interface ExampleMasonryItemProps extends ExampleMasonryData {
  base: string
}

function ExampleMasonryItem(props: ExampleMasonryItemProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const copyTargetRef = React.useRef();
  const timeoutRef = React.useRef(-1);
  const setClose = () => setOpen(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const imgSrc = require(`/example/${props.base}/${props.image}`).default;
  const imgAlt = `${props.name[0]}例图`;

  function copyExample() {
    copyTextToClipboard(props.example, {
      target: copyTargetRef.current // target 必须在 Dialog 内，否则不能复制
    });
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1000);
  }

  return (
    <React.Fragment key={props.name[0]}>
      <ButtonBase className={classes.MasonryButton} onClick={() => setOpen(true)}>
        <div className={classes.MasonryImage}>
          <img
            src={imgSrc}
            alt={imgAlt}
            loading="lazy"
          />
        </div>
        {props.name[0]}
      </ButtonBase>
      <Dialog open={open} onClose={setClose} fullScreen={fullScreen}>
        <div className={classes.DetailHeader}>
          <DialogTitle className={classes.DetailTitle}>
            <span className={classes.DetailName}>{props.name[0]}</span>
            <span className={classes.DetailBrief}>
              {props.brief}
            </span>
          </DialogTitle>
          <IconButton className={classes.DetailClose} onClick={setClose}>
            <MdiIcon path={mdiClose} />
          </IconButton>
        </div>
        <DialogContent className={classes.DetailContent} ref={copyTargetRef}>
          <pre className={classes.DetailExample}>
            <div className={classes.DetailExampleHeader}>
              <div className={classes.DetailExampleContent}>
                {props.example}
              </div>
              <Tooltip title={copied ? "已复制" : "复制"}>
                <Button className={classes.DetailExampleCopy} onClick={copyExample}>
                  <ShrinkIcons flip={copied}>
                    <MdiIcon path={mdiContentCopy} />
                    <MdiIcon path={mdiCheck} />
                  </ShrinkIcons>
                </Button>
              </Tooltip>
            </div>
            <img
              className={classes.DetailImage}
              src={imgSrc}
              alt={imgAlt}
              loading="lazy"
            />
          </pre>
          <pre className={classes.DetailUsage}>
            {props.usage}
          </pre>
          <div className={classes.DetailInfo}>
            {props.name.length > 1 &&
              <>
                {"别名 "}
                {props.name.slice(1).map((n, i) =>
                  <React.Fragment key={n}>
                    {i != 0 && "、"}
                    <code>/{n}</code>
                  </React.Fragment>
                )}
                <br />
              </>
            }
            权限节点 <code>{props.perm}</code>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

interface ExampleMasonryProps {
  base: string
  children: ExampleMasonryData[]
}

export default function ExampleMasonry(props: ExampleMasonryProps): JSX.Element {
  const [limit, setLimit] = React.useState(Math.min(20, props.children.length));
  const [auto, setAuto] = React.useState(true);
  const showMoreRef = React.useRef();
  const showAll = () => setLimit(props.children.length);
  function showMore() {
    setLimit(Math.min(limit + 20, props.children.length));
  }
  React.useEffect(() => {
    if (auto && showMoreRef.current) {
      const observer = new IntersectionObserver(ent => {
        if (ent[0].intersectionRatio > 0) {
          showMore();
          observer.disconnect();
        }
      });
      observer.observe(showMoreRef.current);
      return () => observer.disconnect();
    }
  }, [auto, limit]);
  const items: JSX.Element[] = [];
  for (let i = 0; i < limit; i++) {
    const item = props.children[i];
    items.push(<ExampleMasonryItem key={item.name[0]} base={props.base} {...item} />);
  }

  return (
    <>
      {limit < props.children.length &&
        <>
          <Button fullWidth variant="contained" onClick={showAll}>直接显示全部</Button>
          <FormControlLabel
            control={<Checkbox checked={auto} onChange={e => setAuto(e.target.checked)} />}
            label="自动加载"
          />
        </>
      }
      <Masonry columns={{xs: 2, sm: 3, lg: 4}} spacing={1}>
        {items}
      </Masonry>
      {limit < props.children.length &&
        <Button variant="contained" fullWidth ref={showMoreRef} onClick={showMore}>
          显示更多
        </Button>
      }
    </>
  );
}
