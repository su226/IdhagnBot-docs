import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import { Base64 } from 'js-base64';
import React from "react";
import { copy } from "./common";

const Command = styled.pre`
  white-space: pre-wrap;
  word-break: break-all;
  margin: var(--ifm-leading) 0;
`;

export default function FoxtailSubmit() {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [name, setName] = React.useState("");
  function onNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
    setError(false);
  };
  const [type, setType] = React.useState(0);
  function onTypeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setType(parseInt(event.target.value));
  };
  const [desc, setDesc] = React.useState("");
  function onDescChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDesc(event.target.value);
  };
  const [note, setNote] = React.useState("");
  function onNoteChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNote(event.target.value);
  };
  const data = {name, type, desc, note};
  const command = "/兽云祭投稿 " + Base64.encode(JSON.stringify(data));
  function copyCommand() {
    if (!name) {
      setOpen(true);
      setError(true);
    } else {
      copy(command);
    }
  }
  function handleClose(event: React.SyntheticEvent | Event, reason?: string) {
    if (reason !== "clickaway") {
      setOpen(false);
    }
  }

  return (
    <>
      <TextField onChange={onNameChange} error={error} label="名字" variant="outlined" margin="dense" fullWidth />
      <FormControl margin="dense" fullWidth>
        <FormLabel>类型</FormLabel>
        <RadioGroup onChange={onTypeChange} defaultValue="0" row>
          <FormControlLabel value="0" control={<Radio />} label="设定" />
          <FormControlLabel value="1" control={<Radio />} label="兽装" />
          <FormControlLabel value="2" control={<Radio />} label="插画" />
        </RadioGroup>
      </FormControl>
      <FormControl margin="dense" fullWidth>
        <TextField onChange={onDescChange} label="备注" variant="outlined" />
        <FormHelperText>可选</FormHelperText>
      </FormControl>
      <FormControl margin="dense" fullWidth>
        <TextField onChange={onNoteChange} label="审核留言" variant="outlined" />
        <FormHelperText>可选，不会公开，只有审核能看到。</FormHelperText>
      </FormControl>
      <Button onClick={copyCommand} variant="contained" fullWidth>复制投稿命令</Button>
      <Command>{command}</Command>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="你似乎还没有填写名字"
        anchorOrigin={{vertical: "bottom", horizontal: "center"}}
      />
    </>
  );
};
