import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import adminRoutes from "../routes/index.js";
import bodyParser from "body-parser";
config();

const app = express();

const PORT = process.env.PORT || 1000;




app.use(
  cors({
    origin: "*", // Specify your exact frontend origin
    credentials: true, // Allow credentials
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed methods
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
