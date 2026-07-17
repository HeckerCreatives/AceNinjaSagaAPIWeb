const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const http = require("http");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const dns = require("dns").setServers(['1.1.1.1', '8.8.8.8'])
require("dotenv").config();

const { securityHeaders } = require("./middleware/security");

const app = express();

// Behind a reverse proxy (deployment): trust it so secure cookies and the
// rate limiter see the real client IP / protocol.
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(securityHeaders);

const {initialize} = require("./initialization/serverinitialize")
const {socketserver} = require("./socket/socket-web-config")
const CORS_ALLOWED = process.env.ALLOWED_CORS

const corsConfig = {
    origin: CORS_ALLOWED.split(" "),
    methods: ["GET", "POST", "PUT", "DELETE"], // List only` available methods
    credentials: true, // Must be set to true
    allowedHeaders: ["Origin", "Content-Type", "X-Requested-With", "Accept", "Authorization"],
    credentials: true, // Allowed Headers to be received
};

app.use(cors(corsConfig));
const server = http.createServer(app);

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    initialize();
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));
  

app.use(bodyParser.json({ limit: "10mb" }))
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false, parameterLimit: 5000 }))
app.use(cookieParser());
// Strip keys containing `$` or `.` from body/query/params to block NoSQL
// operator injection ($ne, $gt, $where, ...).
app.use(mongoSanitize());

// Routes
require("./routes")(app);

socketserver(server, corsConfig);

const port = process.env.PORT || 5001; // Dynamic port for deployment
server.listen(port, () => console.log(`Server is running on port: ${port}`));