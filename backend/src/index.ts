import  { WebSocketServer , WebSocket } from "ws"

const wss = new  WebSocketServer({port :8080}) ;

let senderSocket : null | WebSocket = null ;
let receiverSocket : null | WebSocket = null ;


wss.on("connection"  , (ws : WebSocket) => {
   
    ws.on("error" , (error) => {
        console.log(error) ;
    })

    ws.on("message" , (data : any ) => {
        const message = JSON.parse(data) ;
        // console.log(message)
        if(message.type === "Sender") {
            console.log("Sender come" ) ;
            senderSocket = ws ;
        }
        else  if(message.type === " Receiver"){
            receiverSocket = ws ;
        }else if(message.type === "create-offer") {
            receiverSocket?.send(JSON.stringify({
                type : "offer" , 
                sdp : message.sdp 
            }))
        }else if(message.type === "create-answer") {
            senderSocket?.send(JSON.stringify({
                type : "answer" ,
                sdp : message.sdp 
            }))
        }else if(message.type === "ice-candidates"){
            if(ws === senderSocket ){
                receiverSocket?.send(JSON.stringify({
                    type : "iceCandidates",
                    candidate : message.candidate 
                }))
            }else if(ws === receiverSocket){
                senderSocket?.send(JSON.stringify({
                    type : "iceCandidates",
                    candidate : message.candidate
                }))
            }
        }
    })
})