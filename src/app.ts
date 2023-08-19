import "dotenv/config";
import express, { Express } from "express";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes";
import errHandler from "./middleware/errHandler";

const app: Express = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "..", "public")));

//Config body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

routes.forEach(({ path, route }) => {
  app.use(path, route);
});

// use middleware for handling errors
app.use(errHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
