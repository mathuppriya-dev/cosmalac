import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Initialize Database Connection (or JSON fallback)
  await connectDB();

  // Start HTTP Server
  app.listen(PORT, () => {
    console.log(`🌸 COSMALAC Premium Skincare Server running on port ${PORT}`);
  });
};

startServer().catch(err => {
  console.error('❌ Failed to start Cosmalac server:', err);
  process.exit(1);
});
