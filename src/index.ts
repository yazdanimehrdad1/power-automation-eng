import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'PAE Site Collector API is running' });
});

// API routes
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 