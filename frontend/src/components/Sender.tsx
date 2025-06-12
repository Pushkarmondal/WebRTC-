import { useEffect, useState } from "react";

export const Sender = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [pc, setPC] = useState<RTCPeerConnection | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        setSocket(socket);
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "sender" }));
        };
        return () => {
            pc?.close();
            socket.close();
        };
    }, []);

    const initiateConn = async () => {
        if (!socket) {
            alert("Socket not found");
            return;
        }

        const newPC = new RTCPeerConnection(); // ✅ Use a local variable
        setPC(newPC); // Still update the state in case needed elsewhere

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "createAnswer") {
                await newPC.setRemoteDescription(message.sdp); // ✅ Use newPC
            } else if (message.type === "iceCandidate") {
                newPC.addIceCandidate(message.candidate);
            }
        };

        newPC.onicecandidate = (event) => {
            if (event.candidate) {
                socket.send(
                    JSON.stringify({
                        type: "iceCandidate",
                        candidate: event.candidate,
                    })
                );
            }
        };

        newPC.onnegotiationneeded = async () => {
            console.log("negotiationneeded");
            const offer = await newPC.createOffer();
            await newPC.setLocalDescription(offer);
            socket.send(
                JSON.stringify({
                    type: "createOffer",
                    sdp: newPC.localDescription,
                })
            );
        };

        getCameraStreamAndSend(newPC);
    };

    const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            const video = document.createElement("video");
            video.srcObject = stream;
            video.play();

            document.body.appendChild(video); // You may want to use React for this
            stream.getTracks().forEach((track) => {
                pc.addTrack(track, stream);
            });
        });
    };

    return (
        <div>
            <h2>Sender</h2>
            <button onClick={initiateConn}>Send data</button>
        </div>
    );
};
