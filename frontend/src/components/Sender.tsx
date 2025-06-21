import React, { useEffect, useState } from 'react'

const Sender = () => {
  const [socket , setSocket] = useState<WebSocket | null >(null) ;

  useEffect(()=>{
    const socket = new WebSocket('ws://localhost:8080'); 
    socket.onopen  =  () => {
      socket.send(JSON.stringify({
        type : "Sender"
      }))
    }
    setSocket(socket)
  } , [])


  const startSendingVideo = async () => {

    console.log("Inside startSending video")
    if(!socket){
      return ;
    }
    const pc = new RTCPeerConnection() ;
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    socket?.send(JSON.stringify({
      type :"create-offer" ,
      sdp : offer
    })) 

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data) ;

      if(data.type === "answer"){
        pc.setRemoteDescription(data.sdp)
      }
    }
  }

  return (
    <div>
      Sender
      <button onClick={startSendingVideo}>Send video</button>
    </div>
  )
}

export default Sender
