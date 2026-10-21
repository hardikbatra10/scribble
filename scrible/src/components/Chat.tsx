import { useEffect, useState } from 'react';
import {socket} from '../socket';
import InputBox from './InputBox';

type ChatMessage = {
  name: string;
  message: string;
};

export default function Chat({roomId, name}: {roomId: string, name: string}){

  const [message, setMessage] = useState("");
  const [allMessage, setAllMessage] = useState<{name: string, message: string}[]>([]);


 useEffect(() => {
  const handleChatMessage = (data: ChatMessage) => {
    setAllMessage((prev) => [...prev, data]);
  };

  socket.on("chat_message", handleChatMessage);

  return () => {
    socket.off("chat_message", handleChatMessage);
  }
 }, []);



  return (
    <>
      <div className='fixed right-0 top-0 h-screen w-80 bg-amber-50 border-l shadow-lg flex flex-col'>
        <div>
          <h1 className='h-10.5 border-b flex items-center justify-center gap-6 px-4'>Chat</h1>
        </div>

        {/* <ChatInput message={message} setMessage={setMessage} roomId={roomId} name={name} allMessage={allMessage} setAllMessage={setAllMessage}/> */}

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
          {allMessage.map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex gap-1 items-center w-full rounded bg-white px-3 py-2 shadow-sm">
              <div className="text-xs font-bold text-blue-400">{item.name}: </div>
              <div className="text-xs text-gray-900 break-all">{item.message}</div>
            </div>
          ))}
        </div>

          <div className="p-2 flex gap-2">
            <InputBox message={message} setMessage={setMessage} roomId={roomId} name={name}/>
          </div>
      </div>
    </>
  )
}