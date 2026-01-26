import { createContext, useContext, useState } from "react";
import { Button } from "./ui/button";

interface TCounterContext {
    count: number
    setCount: (key: number) => any
}


const ChatContext = createContext<TCounterContext>({ count: 0, setCount: () => { } });

function Root({ children }: { children: React.ReactNode }) {
    const [count, setCount] = useState(0)

    return (
        <ChatContext.Provider value={{ count, setCount }}>
            {children}
        </ChatContext.Provider >
    );
}

function Current() {
    const { count } = useContext(ChatContext)
    return <div>The count is: {count}</div>
}

function Increment() {
    const { count, setCount } = useContext(ChatContext)
    return <Button onClick={() => setCount(count + 1)}>Increment</Button>
}

function Reset() {
    const { setCount } = useContext(ChatContext)
    return <Button onClick={() => setCount(0)}>Reset</Button>
}


export default {
    Root,
    Current,
    Increment,
    Reset
}