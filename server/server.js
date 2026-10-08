const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load Environment Variables immediately before any other module initialization
dotenv.config();

const connectDB = require("./config/db");
const configureAdminOperationsGrid = require("./config/adminEndpoints");

// ==========================================
// 🚦 Core API Sub-Routes Imports
// ==========================================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const organizerRoutes = require("./routes/organizerRoutes");
const templeRoutes = require("./routes/templeRoutes");
const slotRoutes = require("./routes/slotRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const qrRoutes = require("./routes/qrRoutes");
const adminRoutes = require("./routes/adminRoutes");
const organizerTempleRoutes = require("./routes/organizerTempleRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const profileRoutes = require("./routes/profileRoutes");
const organizerProfileRoutes = require("./routes/organizerProfileRoutes");
const adminAnalyticsRoutes = require("./routes/adminAnalyticsRoutes");

const { swaggerUi, swaggerSpec } = require("./config/swagger");

// ==========================================
// 🔒 HTTP Security Layer Modules
// ==========================================
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const logger = require("./middleware/loggerMiddleware");
const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

const isProduction = process.env.NODE_ENV === "production";

// If deployed behind a reverse proxy / load balancer (Render, Railway, nginx, etc.),
// this makes express-rate-limit and req.ip use the real client IP instead of the proxy's.
app.set("trust proxy", 1);

// ==========================================
// 🛠️ Essential Request Parsers & CORS Nodes
// ==========================================
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Dev-only connect targets (Vite dev server, HMR websocket) are kept out of
// production's CSP so we don't ship dead/unnecessary directives.
const devConnectSrc = isProduction
    ? []
    : ["http://localhost:5000", "ws://localhost:5173"];

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // "same-origin" is the safer default; only relax this if Razorpay's
    // checkout flow actually requires window.opener access (test before changing).
    crossOriginOpenerPolicy: { policy: "same-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            // Removed 'unsafe-eval' and 'unsafe-inline' — Razorpay's checkout.js
            // does not require eval, and inline scripts are a common XSS vector.
            // If a specific inline script needs to run, use a nonce instead.
            scriptSrc: ["'self'", "https://checkout.razorpay.com"],
            connectSrc: ["'self'", "https://razorpay.com", "https://api.razorpay.com", ...devConnectSrc],
            frameSrc: ["'self'", "https://razorpay.com", "https://api.razorpay.com"],
            imgSrc: [
    "'self'",
    "data:",
    "https://unsplash.com",
    "https://images.unsplash.com",
    "https://plus.unsplash.com",
    "https://razorpay.com"
],
            styleSrc: ["'self'", "'unsafe-inline'"]
        }
    }
}));

app.use(logger);

// Rate Limiting to protect backend from overload crashes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, try again later" }
});
app.use(limiter);

// ==========================================
// 🚦 Register APIs into Express Context
// ==========================================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/organizer", organizerRoutes);
app.use("/api/temple", templeRoutes);
app.use("/api/slot", slotRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/organizer/temples", organizerTempleRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/organizer/profile", organizerProfileRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);

// NOTE: bookingRoutes is intentionally also mounted under /api/bookings and
// /api/bookings/my-history for frontend compatibility (some clients call the
// plural path). Since all three point at the same router, make sure any new
// route added to bookingRoutes is meant to be reachable from all three prefixes —
// otherwise prefer adding it only under /api/booking to avoid confusion.
app.use("/api/bookings/my-history", bookingRoutes);
app.use("/api/bookings", bookingRoutes);

// Attach Admin Operations Strategy Grid Configuration
configureAdminOperationsGrid(app);

// Swagger Documentation UI Node Setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => res.send("🚩 Central API Gateway Online."));

// Fallback Error Middleware Chain (MUST REMAIN AT BOTTOM)
app.use(notFound);
app.use(errorHandler);

// ==========================================
// ⚡ Bootstrapping & Operational Server Start
// ==========================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Attempt Database Initialization before listening to inbound HTTP requests
    await connectDB();
    console.log("🗄️ Database Connected Successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server Running Dynamically On Port ${PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("🚨 Critical Server Bootstrapping Failure:", error.message);
    // Safe fall-back server instantiation even if database is temporarily unavailable
    app.listen(PORT, () => {
      console.log(`⚠️ Server Running in Fallback Mode on Port ${PORT} (Database Offline)`);
    });
  }
};

startServer();