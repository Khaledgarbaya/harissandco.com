// src/promts.ts
import {
  select as baseSelect,
  text as baseText,
  confirm as baseConfirm,
  intro,
  note,
  outro,
  spinner,
  cancel,
  isCancel
} from "@clack/prompts";
var checkIsCancel = (value) => {
  if (isCancel(value)) {
    cancel("Operation cancelled.");
    return process.exit(0);
  }
};
var select = async (props) => {
  const selectedValue = await baseSelect(props);
  checkIsCancel(selectedValue);
  return selectedValue;
};
var text = async (props) => {
  const textValue = await baseText(props);
  checkIsCancel(textValue);
  return textValue;
};
var confirm = async (props) => {
  const textValue = await baseConfirm(props);
  checkIsCancel(textValue);
  return textValue;
};
export {
  cancel,
  checkIsCancel,
  confirm,
  intro,
  note,
  outro,
  select,
  spinner,
  text
};
