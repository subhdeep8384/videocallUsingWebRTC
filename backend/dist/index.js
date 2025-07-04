"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let receiverSocket = null;
wss.on("connection", (ws) => {
    ws.on("error", (error) => {
        console.log(error);
    });
    ws.on("message", (data) => {
        const message = JSON.parse(data);
        // console.log(message)
        if (message.type === "Sender") {
            console.log("Sender come");
            senderSocket = ws;
        }
        else if (message.type === "Receiver") {
            console.log("receiver come");
            receiverSocket = ws;
        }
        else if (message.type === "create-offer") {
            console.log("Offer come");
            console.log(message.sdp);
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({
                type: "offer",
                sdp: message.sdp
            }));
        }
        else if (message.type === "create-answerer") {
            console.log("Answer come");
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({
                type: "answer",
                sdp: message.sdp
            }));
        }
        else if (message.type === "ice-candidates") {
            console.log("Inside message type ===== ice-candidates");
            console.log(message.candidate);
            if (ws === senderSocket) {
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({
                    type: "iceCandidates",
                    candidate: message.candidate
                }));
            }
            else if (ws === receiverSocket) {
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({
                    type: "iceCandidates",
                    candidate: message.candidate
                }));
            }
        }
    });
});
