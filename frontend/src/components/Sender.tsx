import  { useEffect, useState } from 'react'

const Sender = () => {
  const [socket , setSocket] = useState<WebSocket | null >(null) ;
  const [pc , setPc] = useState<RTCPeerConnection | null>(null) ; 
  useEffect(()=>{
    const socket = new WebSocket('ws://localhost:8080'); 
    socket.onopen  =  () => {
      socket.send(JSON.stringify({
        type : "Sender"
      }))
    }
    setSocket(socket)
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    }) ;
    setPc(pc)
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data) ;
      console.log("DATA IS ::::::::::::::::" ,  data)
      if(data.type === "answer"){
        pc.setRemoteDescription(data.sdp)
      }else if(data.type === "iceCandidates"){
        pc?.addIceCandidate(data.candidate)
      }
    }

  } , [])


  const startSendingVideo = async () => {

    console.log("Inside startSending video")
    if(!socket){
      return ;
    }
    if(!pc){
      return ;
    }


   


    pc.onnegotiationneeded = async () => {
      console.log("on negotiation needed")
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      socket?.send(JSON.stringify({
        type :"create-offer" ,
        sdp : pc.localDescription
      })) 

      pc.onicecandidate = (event) => {
        console.log("ONICE-----------CANDIDTAES")
        console.log(event)
        if(event.candidate){
          socket?.send(JSON.stringify({
            type : "ice-candidates" ,
            candidate : event.candidate
          }))
        }
      }
  
  
    }
    try {
      console.log("🟡 Attempting to get screen stream...");
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });
      console.log("🟢 Got stream:", stream);
    
      stream.getTracks().forEach(track => {
        console.log("🎥 Track:", track.kind);
        pc.addTrack(track, stream);
      });
    } catch (err) {
      console.error("❌ Error getting display media:", err);
      alert("Screen share failed: " + err.message);
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
