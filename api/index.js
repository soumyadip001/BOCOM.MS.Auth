import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { ORIGIN, CREDENTIALS, PORT } from "../config/index.js";
import routes from "./routes.js";
import { connectDb } from "../db/index.js";
// import { testConnection } from "../db/test_conn.js"

const app = express();

app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
await connectDb();
// await testConnection();

// Sync models with the database
// await sequelize.sync({ alter: true });

app.use("/", routes);
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

export default app;
