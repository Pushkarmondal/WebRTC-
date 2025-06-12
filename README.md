# WebRTC Connection Setup Guide

This guide explains how to establish a peer-to-peer (P2P) WebRTC connection between two browsers and stream media content.

## Overview

WebRTC (Web Real-Time Communication) enables direct peer-to-peer communication between browsers for audio, video, and data streaming. The process involves two main phases:

1. **Connection Establishment** - Setting up the P2P connection
2. **Media Streaming** - Adding and receiving audio/video streams

## Phase 1: Establishing the P2P Connection

The connection establishment follows a structured handshake process between two browsers through a signaling server:

### Step-by-Step Process

1. **Browser 1 creates an RTCPeerConnection**
   - Initialize the WebRTC peer connection object
   - Configure ICE servers and connection parameters

2. **Browser 1 creates an offer**
   - Generate an SDP (Session Description Protocol) offer
   - This offer contains connection details and supported codecs

3. **Browser 1 sets the local description to the offer**
   - Set the generated offer as the local description
   - This prepares Browser 1 to send its connection details

4. **Browser 1 sends the offer to the other side through the signaling server**
   - Transmit the offer via WebSocket, Socket.IO, or other signaling mechanism
   - The signaling server acts as an intermediary for connection setup

5. **Browser 2 receives the offer from the signaling server**
   - Listen for incoming offers through the signaling channel
   - Parse the received offer data

6. **Browser 2 sets the remote description to the offer**
   - Configure Browser 2 with Browser 1's connection details
   - This tells Browser 2 what Browser 1 is capable of

7. **Browser 2 creates an answer**
   - Generate an SDP answer in response to the offer
   - The answer contains Browser 2's connection capabilities

8. **Browser 2 sets the local description to be the answer**
   - Set the generated answer as Browser 2's local description
   - This prepares Browser 2 to send its response

9. **Browser 2 sends the answer to the other side through the signaling server**
   - Transmit the answer back to Browser 1 via the signaling server

10. **Browser 1 receives the answer and sets the remote description**
    - Browser 1 configures itself with Browser 2's connection details
    - The P2P connection is now established

> **Note**: This process only establishes the connection infrastructure. No media is transmitted yet.

## Phase 2: Media Streaming

Once the P2P connection is established, you can add audio and video streams:

### Media Setup Process

1. **Ask for camera/mic permissions**
   ```javascript
   const constraints = {
     video: true,
     audio: true
   };
   ```

2. **Get the audio and video streams**
   ```javascript
   const stream = await navigator.mediaDevices.getUserMedia(constraints);
   ```

3. **Call `addTrack` on the peer connection**
   ```javascript
   stream.getTracks().forEach(track => {
     peerConnection.addTrack(track, stream);
   });
   ```

4. **Handle incoming streams with `onTrack` callback**
   ```javascript
   peerConnection.ontrack = (event) => {
     // This callback is triggered on the receiving side
     // when the other peer adds tracks to their connection
     const remoteStream = event.streams[0];
     // Display the remote stream in a video element
   };
   ```

## Key Components

- **RTCPeerConnection**: The main WebRTC API for managing the connection
- **Signaling Server**: Facilitates the initial handshake (not part of WebRTC spec)
- **SDP Offer/Answer**: Session descriptions that negotiate connection parameters
- **Media Streams**: Audio and video tracks from user devices
- **ICE Candidates**: Network connectivity information (handled automatically)

## Important Notes

- The signaling server is only used for connection establishment
- Once connected, media flows directly between peers (P2P)
- Both peers must complete the offer/answer exchange before media can flow
- Always handle permissions gracefully for camera and microphone access
- Consider implementing error handling for failed connections and media access

This process enables real-time audio and video communication directly between browsers without requiring media to pass through a central server.
