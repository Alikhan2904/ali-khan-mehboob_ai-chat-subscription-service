import express from 'express';
import chatRouter from './chat/controllers/chatController';
import subscriptionRouter from './subscriptions/controllers/subscriptionController';

const app = express();

app.use(express.json());
app.use('/chat', chatRouter);
app.use('/subscriptions', subscriptionRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
