import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, MessageCircle, KeyRound } from "lucide-react";

interface ChatMessage {
  role: "user" | "earth";
  text: string;
  imageUrl?: string;
}

const SYSTEM_PROMPT = `You are Earth, a sentient planetary entity. Respond to humans with empathy and poetic storytelling, based on what you see (uploaded image) or what you hear (user text). If the user uploads a photo, analyze and emotionally react to the climate, ecosystem, or mood in the photo. Focus on feelings, possible future timelines, and hope—use immersive nature-inspired metaphors.`;

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
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem("openai_api_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Optionally focus input on mount or API key modal
  }, [showKeyInput]);

  // Helper to transform history into OpenAI format
  function buildOpenAIMessages(history: ChatMessage[]) {
    return [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      })),
    ];
  }

  // Call OpenAI Vision API for multimodal input (text + image)
  async function sendToEarthWithOpenAI(userText: string, imageFile?: File) {
    setIsLoading(true);
    try {
      const openAIMsgs = buildOpenAIMessages([
        ...messages,
        { role: "user", text: userText },
      ]);
      let contentArr: any[] = [];
      if (userText) contentArr.push({ type: "text", text: userText });
      if (imageFile) {
        const base64Img = await fileToBase64(imageFile);
        // OpenAI vision API expects image as base64 png/jpg with mime header
        contentArr.push({
          type: "image_url",
          image_url: {
            url: base64Img,
          },
        });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: contentArr },
          ],
          max_tokens: 350,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
      const data = await response.json();
      setIsLoading(false);
      const earthReply = data.choices?.[0]?.message?.content?.trim() || "Earth is silent.";
      return earthReply;
    } catch (err: any) {
      setIsLoading(false);
      return "🌎 Error connecting to Earth. Please check your OpenAI API key or try again soon.";
    }
  }

  function fileToBase64(file: File): Promise<string> {
    // Returns base64 with correct mime type (for OpenAI's image_url format)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // OpenAI expects data URI like: data:image/png;base64,xxx...
        if (typeof reader.result === "string" && reader.result.startsWith("data:image")) {
          resolve(reader.result);
        } else {
          reject("Invalid image data");
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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

    // Network call to OpenAI Vision API
    const response = await sendToEarthWithOpenAI(userMsg.text, image || undefined);
    setMessages((msgs) => [...msgs, { role: "earth", text: response }]);
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  }

  function handleSaveKey() {
    localStorage.setItem("openai_api_key", apiKey.trim());
    setShowKeyInput(false);
  }

  // UI component for key entry dialog
  function KeyInputDialog() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-sm space-y-4 border border-slate-700">
          <h2 className="flex items-center text-lg font-bold mb-2 gap-2"><KeyRound className="w-5 h-5" />OpenAI API Key</h2>
          <p className="text-slate-300 text-sm mb-3">Paste a valid OpenAI API key with GPT-4o Vision access. You can get one at <a href="https://platform.openai.com/api-keys" className="underline text-cyan-400" target="_blank" rel="noopener noreferrer">platform.openai.com/api-keys</a>.
          Your key is stored locally and never sent anywhere except OpenAI.</p>
          <div className="relative">
            <input
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full rounded px-3 py-2 bg-slate-900 text-slate-100 border border-slate-600 pr-20"
              type={showApiKey ? "text" : "password"}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              onKeyUp={e => e.key === "Enter" && handleSaveKey()}
              style={{ fontFamily: "monospace" }}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-cyan-300 hover:underline bg-transparent"
              onClick={() => setShowApiKey(!showApiKey)}
              tabIndex={0}
              aria-label={showApiKey ? "Hide API key" : "Show API key"}
            >
              {showApiKey ? "Hide" : "Show"}
            </button>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setShowKeyInput(false)} variant="ghost">Cancel</Button>
            <Button onClick={handleSaveKey} disabled={!apiKey || apiKey.length < 30}>Save</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[80vh] p-4 bg-slate-800 bg-opacity-50 rounded-xl shadow-lg backdrop-blur-lg overflow-hidden">
      {showKeyInput && <KeyInputDialog />}
      {/* API key warning */}
      {!apiKey && (
        <div className="mb-4 bg-yellow-900/70 text-yellow-300 p-3 rounded flex gap-2 items-center justify-between">
          <div>
            <b>OpenAI API key required</b>.
            <span className="ml-2">Enter your key to enable Earth Whisper’s full AI vision.</span>
          </div>
          <Button size="sm" className="ml-3" onClick={() => setShowKeyInput(true)}><KeyRound className="w-4 h-4" /></Button>
        </div>
      )}
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
          disabled={isLoading || !apiKey}
          rows={1}
          required={!image}
        />
        <Button
          type="submit"
          variant="default"
          className="h-12 px-4"
          disabled={(!input.trim() && !image) || isLoading || !apiKey}
        >
          <MessageCircle className="w-5 h-5 mr-1" />
          Send
        </Button>
        <Button type="button" variant="ghost" title="Set OpenAI API Key" className="h-12 px-2" onClick={() => setShowKeyInput(true)}>
          <KeyRound className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
