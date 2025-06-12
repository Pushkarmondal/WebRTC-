"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import WebSocket and WebSocketServer from the 'ws' (WebSocket) library
const ws_1 = require("ws");
// Create a WebSocket server that listens on port 8080
const wss = new ws_1.WebSocketServer({ port: 8080 });
// Declare two variables to store WebSocket connections for the sender and receiver
let senderSocket = null;
let receiverSocket = null;
// When a new client connects to the WebSocket server
wss.on("connection", function connection(ws) {
    // Log any connection-level errors to the console
    ws.on("error", console.error);
    // Listen for messages from the connected client
    ws.on("message", function message(data) {
        // Parse the incoming message from JSON string to a JavaScript object
        const message = JSON.parse(data);
        // If the client identifies as the sender
        if (message.type === "sender") {
            senderSocket = ws; // Store the current connection as senderSocket
            // If the client identifies as the receiver
        }
        else if (message.type === "receiver") {
            receiverSocket = ws; // Store the current connection as receiverSocket
            // If the sender sends an SDP offer
        }
        else if (message.type === "createOffer") {
            // Ensure only the sender can send an offer
            if (ws !== senderSocket) {
                return; // Ignore the message if it's not from the sender
            }
            // Forward the offer to the receiver
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({
                type: "createOffer",
                sdp: message.sdp,
            }));
            // If the receiver sends an SDP answer
        }
        else if (message.type === "createAnswer") {
            // Ensure only the receiver can send an answer
            if (ws !== receiverSocket) {
                return; // Ignore the message if it's not from the receiver
            }
            // Forward the answer to the sender
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({
                type: "createAnswer",
                sdp: message.sdp,
            }));
            // If either sender or receiver sends an ICE candidate
        }
        else if (message.type === "iceCandidate") {
            // If the ICE candidate came from the sender
            if (ws === senderSocket) {
                // Forward it to the receiver
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({
                    type: "iceCandidate",
                    candidate: message.candidate,
                }));
                // If the ICE candidate came from the receiver
            }
            else if (ws === receiverSocket) {
                // Forward it to the sender
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({
                    type: "iceCandidate",
                    candidate: message.candidate,
                }));
            }
        }
    });
});
