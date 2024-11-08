import express from 'express';
import http from 'http';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle location updates from any client
    socket.on("sendLocation", (data) => {
        // Broadcast the location to all connected clients
        io.emit("receiveLocation", { id: socket.id, ...data });
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        // Notify all clients about the disconnection
        io.emit('userDisconnect', socket.id);
        console.log('A user disconnected');
    });
});


app.get('/', (req, res) => {
    res.render('index');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
