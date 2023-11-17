// Importing necessary modules from the 'express' and 'redis' packages
import express from 'express';
import {createClient, RedisClientType} from 'redis';

// Initialize an Express application
const app: express.Application = express();

// Create a Redis client. The URL specifies the Redis server's address.
// 'my-redis' is the service name as defined in docker-compose.yml, and 6379 is the default Redis port.
const client: RedisClientType = createClient({
    url: 'redis://my-redis:6379'
});

// Attempt to connect to the Redis server and log any connection errors
client.connect().catch((err: Error) => console.error('Redis Connection Error:', err));

// Set up an event listener for any errors that occur on the Redis client after the connection
client.on('error', (err) => console.error('Redis Client Error:', err));

// Asynchronously initialize the 'visits' key in Redis with a value of '0'
// This IIFE (Immediately Invoked Function Expression) is used to execute async code on start-up
(async () => {
    try {
        await client.set('visits', '0');
    } catch (err) {
        console.error('Error initializing Redis:', err);
    }
})();

// Define a route handler for the root URL ('/')
app.get('/', async (req: express.Request, res: express.Response) => {
    try {
        // Retrieve the current number of visits from Redis
        const visits = await client.get('visits');

        // Increment the visit count and store it back in Redis
        await client.set('visits', (parseInt(visits ?? '0') + 1).toString());

        // Send a response with the current visit count
        res.send('Number of visits is ' + visits);
    } catch (err) {
        // If an error occurs during Redis operations, log it and send a server error response
        console.error('Redis Operation Error:', err);
        res.status(500).send('Something went wrong');
    }
});

// Define the server port. Use the PORT environment variable if defined, otherwise default to 4001
const PORT = process.env.PORT || 4001;

// Start the Express server on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
