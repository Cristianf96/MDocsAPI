import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import "reflect-metadata";

import { version } from "../../package.json";
import { corsOptions } from "@app/utils/cors";
import { swaggerSpec, swaggerUi } from "@app/app/swagger";
import routes from "@app/api/routes";
import {
  EHttpStatusCode,
  EHttpStatusMessage,
  EWelcomeMessage,
} from "@app/utils/constants/Enums";

export const app = express();
app.set("port", process.env.PORT ?? 3000);

app.use(cors(corsOptions));
app.use(morgan("combined"));
app.use(helmet());
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    err.status = 404;
    next(err);
  }
);

// Middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// ------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

// Routes
app.get("/", (_req, res) => {
  res.send(`${EWelcomeMessage.welcomeFront} ${version}`);
});

app.use("/api/v1", cors(corsOptions), routes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware para manejar rutas no encontradas
app.use((_req, res, next) => {
  res.status(EHttpStatusCode.NOT_FOUND).send(EHttpStatusMessage.NOT_FOUND);
  next();
});

const init = async () => {
  try {
    app.listen(app.get("port"), () => {
      console.log(`------------------------`);
      console.log(EWelcomeMessage.welcomeApi);
      console.log(
        `${EWelcomeMessage.serverOn} ${app.get("port")} i${
          EWelcomeMessage.inVersion
        } ${version} \n`
      );
      console.log(`Api URL: http://localhost:${app.get("port")}/api/v1`);
      console.log(`Doc URL: http://localhost:${app.get("port")}/docs`);
      console.log(`------------------------`);
    });
  } catch (error) {
    console.error(error);
  }
};

export { init };
