import {socket} from '../socket';

type Props = {
  roomId: string;
  name: string;
  message: string;
  setMessage: (value: string) => void;
};

export default function InputBox({message, setMessage, roomId, name}: Props) {

  const handleSend = () => {
    if(message.length <= 0) return;
    const trimmed = message.trim();
    if(!trimmed) return;
    // setAllMessage(prev => [...prev, {name, message: trimmed}]);
    socket.emit("chat_message", {
      roomId,
      name,
      message: trimmed,
    })
    setMessage("");
  }

  return (
    <>
    <input 
      className="w-full border px-2 py-1 rounded"
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => {
        if(e.key === 'Enter'){
          handleSend();
        }
      }}
      placeholder="Type you guess here..."
    />
    <input type="submit" value="Send" className="border-1 px-1 rounded bg-fuchsia-50 hover:bg-fuchsia-100"
      onClick={handleSend}
    />
    </>
  )
}