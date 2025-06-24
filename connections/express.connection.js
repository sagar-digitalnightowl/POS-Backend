import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import adminRoutes from "../routes/index.js";
import bodyParser from "body-parser";
config();

// cron jobs 
import '../cronJobs/index.js';



const app = express();

const PORT = process.env.PORT || 1000;


const clientUrls = process.env.CLIENT_URLS;
const allowedOrigins = clientUrls.split(",");
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

//middlewares
app.use(bodyParser.json()); // Parses JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(morgan("dev"));

//routes
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Server Running👍");
});

export const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`server started at: http://localhost:${PORT} `);
    });
  } catch (err) {
    throw new Error(err);
  }
};
