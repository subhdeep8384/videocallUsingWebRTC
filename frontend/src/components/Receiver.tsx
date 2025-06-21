import  {useEffect, useRef, useState} from 'react'

const Receiver = () => {
  const videoRef = useRef<HTMLVideoElement | null >(null);

  const [socket , setSocket] = useState<WebSocket | null >(null) ;

  const [pc , setPc ] = useState<RTCPeerConnection | null >(null)
   useEffect(()=> {
    const socket = new WebSocket('ws://localhost:8080'); 
    setSocket(socket)
    socket.onopen = () => {
      socket.send(JSON.stringify({
        type : "Receiver"
      }))
    }

    

    socket.onmessage =async  (event) =>{
      const message = JSON.parse(event.data) ;
      if(message.type === "offer"){
        const pc = new RTCPeerConnection() ;
        setPc(pc)


        pc.ontrack =async (event) => {
          try {
            videoRef.current.srcObject = new MediaStream([event.track]);
            await videoRef.current.play();
          } catch (err) {
            console.warn("Autoplay blocked, showing play button manually");
    
          }
        }
        
        await pc.setRemoteDescription(message.sdp) ;

        pc.onicecandidate = (event) => {
          if(event.candidate){
            socket?.send(JSON.stringify({
              type : "ice-candidates" ,
              candidate : event.candidate
            }))
          }
        }
        const answer = await pc.createAnswer() ;
        await pc.setLocalDescription(answer)

        socket.send(JSON.stringify({
          type : "create-answerer" ,
          sdp : pc.localDescription
        }))

       

      }else if(message.type === "iceCandidates"){
        console.log("addededddeded")
        console.log(message.candidate)
        pc?.addIceCandidate(message.candidate)
      }
        
    }
    
  } , [])


  return (
    <div>
        <video
  ref={videoRef}
  autoPlay
  muted
  playsInline
  controls
  style={{ width: "100%", maxWidth: "100%" }}
/>
    </div>
  )
}

export default Receiver
