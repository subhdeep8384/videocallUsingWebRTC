import React , {useEffect, useState} from 'react'

const Receiver = () => {

  const [socket , setSocket] = useState<WebSocket | null >(null) ;


  useEffect(()=> {
    const socket = new WebSocket('ws://localhost:8080'); 
    socket.onopen = () => {
      socket.send(JSON.stringify({
        type : "Receiver"
      }))
    }

    setSocket(socket)

    socket.onmessage =async  (event) =>{
      const message = JSON.parse(event.data) ;
      if(message.type === "offer"){
        const pc = new RTCPeerConnection() ;
        pc.setRemoteDescription(message.sdp) ;
        const answer = await pc.createAnswer() ;
        await pc.setLocalDescription(answer)

        socket.send(JSON.stringify({
          type : "create-answerer" ,
          sdp : answer
        }))
      }
    }
  } , [])

  return (
    <div>
        receiver hi
    </div>
  )
}

export default Receiver
