"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageCircle, X } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "owner";
  content: string;
  time: string;
}

// MVP 模拟消息
const MOCK_MESSAGES: Message[] = [
  { id: "m1", role: "owner", content: "你好，请问你有喂猫经验吗？", time: "10:30" },
  { id: "m2", role: "user", content: "有的，我养了3年猫，也帮朋友喂过很多次", time: "10:31" },
  { id: "m3", role: "owner", content: "太好了！我家猫比较胆小，进门轻一点就行", time: "10:32" },
];

export function ChatWindow({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function handleSend() {
    if (!input.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, role: "user", content: input.trim(), time },
    ]);
    setInput("");

    // 模拟猫主人自动回复
    setTimeout(() => {
      const replies = ["好的，收到！", "没问题~", "谢谢你！", "了解了，辛苦啦"];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      const t = new Date();
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: "owner",
          content: reply,
          time: `${t.getHours()}:${String(t.getMinutes()).padStart(2, "0")}`,
        },
      ]);
    }, 1000);
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="w-full" variant="outline">
        <MessageCircle className="h-4 w-4 mr-2" />
        联系猫主人
      </Button>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b">
        <span className="text-sm font-medium">与猫主人对话</span>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 消息列表 */}
      <div className="h-64 overflow-y-auto p-3 space-y-3 bg-background">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}>
              <p>{msg.content}</p>
              <p className={`text-[10px] mt-1 ${
                msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 输入框 */}
      <div className="flex gap-2 p-2 border-t">
        <Input
          placeholder="输入消息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
