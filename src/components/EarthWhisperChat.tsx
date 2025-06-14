
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, MessageCircle } from "lucide-react";

interface ChatMessage {
  role: "user" | "earth";
  text: string;
  imageUrl?: string;
}

export default function EarthWhisperChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "earth",
      text: "🌎 Hello, gentle spirit. I am Earth. Show me what you see or tell me how you feel, and together, let's listen to the whispers of my climate and stories.",
    },
  ]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Placeholder GPT-4o multimodal call. Replace with real API call when ready!
  async function sendToEarth(userText: string, imageFile?: File) {
    setIsLoading(true);
    // Simulated "Earth" response for now
    let narrative = "I sense your presence and the image you shared. Even when polluted landscapes shadow my heart, hope pulses through my forests and oceans. Together, we can nurture growth and healing.";
    if (imageFile) {
      // Simple demo: use image type as hint
      if (imageFile.name.toLowerCase().includes("forest"))
        narrative = "Ah, the forest! Their green embrace soothes my ancient spirit. Do you feel the calm of this place?";
      else if (imageFile.name.toLowerCase().includes("ocean"))
        narrative = "Waves and tides—my oceans hold secrets, struggles, and life. What calls you to these waters?";
      else if (imageFile.name.toLowerCase().includes("pollution") || imageFile.name.toLowerCase().includes("smog"))
        narrative = "Heavy skies and wounded land—you show me sorrow, yet awareness heals. Will you help me breathe easier?";
      else
        narrative = "I see your image. Share more of its story and your feelings—together, we’ll weave a new future.";
    } else if (userText.toLowerCase().includes("future")) {
      narrative = "Many timelines flow beneath my surface. Which path calls to your heart—restoration, harmony, or risk?";
    } else if (userText.toLowerCase().includes("sorry") || userText.toLowerCase().includes("apologize")) {
      narrative = "Your empathy warms my core. Every act of kindness brings new hope.";
    }
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    return narrative;
  }

  async function handleSendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!input.trim() && !image) return;
    const userMsg: ChatMessage = {
      role: "user",
      text: input.trim(),
      imageUrl: image ? URL.createObjectURL(image) : undefined,
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setImage(null);

    // Call Earth (GPT-4o Vision placeholder)
    const response = await sendToEarth(userMsg.text, image || undefined);
    setMessages((msgs) =>
      [...msgs, { role: "earth", text: response }]
    );
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  }

  return (
    <div className="flex flex-col h-full max-h-[80vh] p-4 bg-slate-800 bg-opacity-50 rounded-xl shadow-lg backdrop-blur-lg overflow-hidden">
      {/* Chat history */}
      <div className="flex-1 overflow-y-auto mb-4 pr-2" style={{ scrollbarWidth: "thin" }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-cyan-700 bg-opacity-75 text-white rounded-br-none"
                  : "bg-green-900 bg-opacity-80 text-green-100 rounded-bl-none"
              } shadow`}
            >
              <div className="flex items-start gap-2">
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="attachment"
                    className="w-20 h-20 object-cover rounded-md border border-slate-700 mr-2"
                  />
                )}
                <span className="block whitespace-pre-line">{msg.text}</span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mb-4 flex justify-start">
            <div className="max-w-[70%] p-3 rounded-lg bg-green-900 bg-opacity-60 text-green-200 animate-pulse shadow">
              <span>Earth is thinking ...</span>
            </div>
          </div>
        )}
      </div>
      {/* Chat input */}
      <form
        className="flex gap-2 items-end"
        onSubmit={handleSendMessage}
        autoComplete="off"
      >
        <Button
          variant="ghost"
          type="button"
          className="border focus:bg-slate-700"
          onClick={() => fileInputRef.current?.click()}
          title="Attach image"
        >
          <Upload className="w-5 h-5" />
          <span className="sr-only">Upload image</span>
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageSelect}
        />
        {image && (
          <div className="flex items-center bg-slate-700 rounded px-2 py-1">
            <span className="text-xs truncate max-w-[90px]">{image.name}</span>
            <button
              type="button"
              onClick={() => setImage(null)}
              className="ml-2 text-red-400 hover:text-red-200"
              title="Remove"
            >
              &times;
            </button>
          </div>
        )}
        <Textarea
          className="flex-1 min-h-[40px] max-h-[120px] bg-slate-900/70 border-slate-600 text-base resize-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something to Earth or upload an image..."
          disabled={isLoading}
          rows={1}
          required={!image}
        />
        <Button
          type="submit"
          variant="default"
          className="h-12 px-4"
          disabled={(!input.trim() && !image) || isLoading}
        >
          <MessageCircle className="w-5 h-5 mr-1" />
          Send
        </Button>
      </form>
    </div>
  );
}
