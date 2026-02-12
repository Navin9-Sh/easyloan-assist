import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Send, ArrowLeft } from "lucide-react";
import type { Conversation, Message, Profile as ProfileType } from "@/types/marketplace";
import { formatDistanceToNow } from "date-fns";
import { useRef } from "react";

const Chat = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) { navigate("/auth"); return null; }

  if (conversationId) {
    return <ChatRoom conversationId={conversationId} userId={user.id} />;
  }

  return <ConversationList userId={user.id} />;
};

function ConversationList({ userId }: { userId: string }) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("conversations")
        .select(`
          *,
          listings(title, listing_images(url)),
          buyer:profiles!conversations_buyer_id_fkey(full_name, avatar_url),
          seller:profiles!conversations_seller_id_fkey(full_name, avatar_url)
        `)
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order("updated_at", { ascending: false });

      setConversations(data || []);
      setLoading(false);
    };
    fetch();
  }, [userId]);

  if (loading) return <div className="section-container py-6"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="section-container py-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      {conversations.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">No conversations yet.</p>
      ) : (
        <div className="space-y-2 max-w-lg mx-auto">
          {conversations.map((conv: any) => {
            const otherProfile = conv.buyer_id === userId ? conv.seller : conv.buyer;
            return (
              <Link key={conv.id} to={`/chat/${conv.id}`}>
                <Card className="p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={otherProfile?.avatar_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {otherProfile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{otherProfile?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{conv.listings?.title || "Listing"}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChatRoom({ conversationId, userId }: { conversationId: string; userId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch conversation details
    supabase
      .from("conversations")
      .select(`
        *,
        listings(title),
        buyer:profiles!conversations_buyer_id_fkey(full_name, avatar_url),
        seller:profiles!conversations_seller_id_fkey(full_name, avatar_url)
      `)
      .eq("id", conversationId)
      .maybeSingle()
      .then(({ data }) => setConversation(data));

    // Fetch messages
    supabase
      .from("messages")
      .select("*, sender:profiles!messages_sender_id_fkey(full_name, avatar_url)")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data || []));

    // Mark messages as read
    supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId);

    // Realtime subscription
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      }, async (payload) => {
        const { data } = await supabase
          .from("messages")
          .select("*, sender:profiles!messages_sender_id_fkey(full_name, avatar_url)")
          .eq("id", payload.new.id)
          .single();
        if (data) {
          setMessages((prev) => [...prev, data]);
          // Mark as read if from other user
          if (data.sender_id !== userId) {
            supabase.from("messages").update({ read: true }).eq("id", data.id);
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    setSending(true);

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      content: newMessage.trim(),
    });

    // Update conversation timestamp
    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);

    setNewMessage("");
    setSending(false);
  };

  const otherProfile = conversation
    ? (conversation.buyer_id === userId ? conversation.seller : conversation.buyer)
    : null;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="border-b p-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/chat")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={otherProfile?.avatar_url || ""} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {otherProfile?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{otherProfile?.full_name || "User"}</p>
          <p className="text-xs text-muted-foreground">{conversation?.listings?.title || ""}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isOwn = msg.sender_id === userId;
          return (
            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}>
                <p>{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="border-t p-3 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          maxLength={1000}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim() || sending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

export default Chat;
