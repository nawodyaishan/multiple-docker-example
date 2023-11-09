import express, {Request, Response} from 'express';
import {createClient} from 'redis';

// Create an Express application
const app: express.Application = express();

// Define the port to run the server on
const PORT: string | number = process.env.PORT || 3000;

// Create a Redis client using the modern createClient function
const client = createClient({});

// Establish a connection with the Redis client
client.connect().catch(console.error);

app.get('/', async (req: Request, res: Response) => {
    try {
        // Try to get the number of visits from Redis
        let visits = await client.get('visits');
        let visitCount: number = parseInt(visits ?? '0') + 1;

        // Increment the visit count and store it back in Redis
        await client.set('visits', visitCount.toString());

        // Send a JSON response with the visit count
        res.json({message: 'Yeah! Docker baby 🐳', visits: visitCount});
    } catch (error) {
        // If an error occurs, send a server error status code
        console.error(error);
        res.status(500).send('Something went wrong with Redis');
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});