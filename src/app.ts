import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import config from "config";
import cors from "cors";
import fileUpload from "express-fileupload";
import userRoute from "./router/user.routes";
import fuelInRoute from "./router/fuelIn.routes";

import roleRoute from "./router/role.routes";
import permitRoute from "./router/permit.routes";
import stationDetailRoute from "./router/stationDetail.routes";
import dailyReportRoute from "./router/dailyReport.routes";
import detailSaleRoute from "./router/detailSale.routes";
import { backup } from "./backup/backup";
import { migrate } from "./migration/migrator";
import { daily } from "./migration/dailyReport.migrate";
import fuelBalanceRoute from "./router/fuelBalance.routes";

const app = express();
app.use(express.json());
app.use(fileUpload());
app.use(cors({ origin: "*" }));
const server = require("http").createServer(app);

//require data

const port = config.get<number>("port");
const host = config.get<string>("host");
const dbUrl = config.get<string>("dbUrl");

//mongodb connection

mongoose.connect(dbUrl);

// request routes

app.get("/api", (req: Request, res: Response, next: NextFunction) => {
  res.send("ok");
});

//app => routes => controller => service => model

app.use("/api/user", userRoute);
app.use("/api/role", roleRoute);
app.use("/api/permit", permitRoute);

app.use("/api/fuelIn", fuelInRoute);

app.use("/api/station-detail", stationDetailRoute);
app.use("/api/daily-report", dailyReportRoute);
app.use("/api/detail-sale", detailSaleRoute);
app.use("/api/fuel-balance", fuelBalanceRoute);
//Error Routes

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 409;
  res.status(err.status).json({
    con: false,
    msg: err.message,
  });
});

//migrate
migrate();

// // back up
backup(dbUrl);

//daily
daily();

server.listen(port, () =>
  console.log(`server is running in  http://${host}:${port}`)
);
