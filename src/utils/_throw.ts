import { Throw } from "../types/custom";

const _throw = ({ errors = { field: "", message: "" }, meta = "", message = "", code = 500 }: Throw) => {
  // !message && (message = "");
  // !code && (code = 500);
  // !meta && (meta = "");
  // !errors && (errors = "");
  throw { errors, meta, code, message };
};

export default _throw;
