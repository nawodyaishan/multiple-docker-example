import express from 'express';
import {createClient, RedisClientType} from 'redis';

const app: express.Application = express();

// Create a Redis client with default configuration
// This will connect to Redis running on localhost:6379
const client: RedisClientType = createClient();

// Connect to Redis and handle any connection errors
client.connect().catch((err: Error) => console.error('Redis Connection Error:', err));

// Error event listener for the Redis client
client.on('error', (err) => console.error('Redis Client Error:', err));

// Initialize the 'visits' key in Redis
(async () => {
    try {
        await client.set('visits', '0');
    } catch (err) {
        console.error('Error initializing Redis:', err);
    }
})();

// Define a route to track and display the number of visits
app.get('/', async (req: express.Request, res: express.Response) => {
    try {
        // Retrieve the current visit count from Redis
        const visits = await client.get('visits');

        // Increment and update the visit count in Redis
        await client.set('visits', (parseInt(visits ?? '0') + 1).toString());

        // Send the current visit count as a response
        res.send('Number of visits is ' + visits);
    } catch (err) {
        // Handle any errors during Redis operations
        console.error('Redis Operation Error:', err);
        res.status(500).send('Something went wrong');
    }
});

// Define the server port (default to 4001 if not set in environment)
const PORT = process.env.PORT || 4001;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
