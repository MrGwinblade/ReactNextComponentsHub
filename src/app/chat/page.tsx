"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, Search, Send } from "lucide-react"

export default function MessagesPage() {
  const router = useRouter()
  const [selectedChat, setSelectedChat] = useState<number | null>(null)

  const chats = [
    { id: 1, name: "John Doe", lastMessage: "Hey, how are you?", time: "12:30", unread: 2 },
    { id: 2, name: "Jane Smith", lastMessage: "The meeting is at 3 PM", time: "10:45" },
    { id: 3, name: "Mike Johnson", lastMessage: "Thanks!", time: "Yesterday" },
  ]

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex items-center gap-4 p-4 border-b bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.push("/?component=profileButton")}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Messages</h1>
      </div>

      <div className="flex flex-1">
        <div className="w-80 border-r bg-white">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input className="pl-9" placeholder="Search messages..." />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            {chats.map((chat) => (
              <button
                key={chat.id}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 ${
                  selectedChat === chat.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex justify-between">
                    <span className="font-medium">{chat.name}</span>
                    <span className="text-sm text-gray-500">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                    {chat.unread}
                  </span>
                )}
              </button>
            ))}
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b bg-white">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>{chats.find((c) => c.id === selectedChat)?.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{chats.find((c) => c.id === selectedChat)?.name}</span>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">{/* Chat messages would go here */}</ScrollArea>
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

