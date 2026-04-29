import React, { useState, useEffect, useRef } from "react";
import { uploadDocument, chatWithRag, listDocuments, deleteDocument } from "../api";
import { Link } from "react-router-dom";

export default function RAGChat() {
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const chatContainerRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchDocuments = async () => {
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    try {
      await uploadDocument(file);
      await fetchDocuments();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    try {
      await deleteDocument(id);
      await fetchDocuments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await chatWithRag(input, sessionId);
      if (!sessionId) setSessionId(data.session_id);
      
      const aiMsg = { 
        role: "assistant", 
        content: data.answer, 
        sources: data.sources 
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "error", content: err.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/10 bg-slate-900/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="text-cyan-400 text-sm font-bold flex items-center gap-2 mb-4 hover:text-cyan-300 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Dashboard
          </Link>
          <h2 className="text-xl font-bold">Knowledge Base</h2>
          <p className="text-xs text-slate-400 mt-1">Upload docs to chat with them</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div 
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
              dragActive ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 hover:border-white/20"
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Uploading...</span>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => handleUpload(e.target.files[0])}
                  accept=".pdf,.docx,.txt,.csv"
                />
                <svg className="mx-auto h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="mt-2 block text-xs font-medium">Drop files or click to upload</span>
                <span className="mt-1 block text-[10px] text-slate-500">PDF, DOCX, TXT, CSV</span>
              </label>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2">Uploaded Documents</h3>
            {documents.length === 0 ? (
              <p className="text-xs text-slate-500 px-2 italic">No documents yet</p>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="group flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold uppercase text-cyan-400">{doc.type}</span>
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-[10px] text-slate-500">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => { setMessages([]); setSessionId(null); }}
            className="w-full py-2 text-xs font-medium text-slate-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition"
          >
            Clear Chat History
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 bg-launchpilot-grid bg-[length:32px_32px] opacity-20 pointer-events-none" />
        
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <h1 className="font-bold">LaunchPilot RAG AI</h1>
          </div>
          <div className="text-xs text-slate-500">
            Powered by Gemini Pro + ChromaDB
          </div>
        </header>

        {/* Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-8 space-y-6 z-10"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">How can I help you today?</h3>
              <p className="text-slate-400 text-sm">
                Ask me anything about your uploaded documents. I can summarize, analyze, or answer specific questions with citations.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-8 w-full">
                {["Summarize this PDF", "What are the key risks?", "Extract financial metrics", "Compare these docs"].map((suggestion) => (
                  <button 
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="p-3 text-xs text-left rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                  msg.role === "user" 
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-950/20" 
                    : msg.role === "error"
                    ? "bg-red-500/20 border border-red-500/50 text-red-200"
                    : "bg-slate-800 text-slate-100 border border-white/10 shadow-xl"
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Sources</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((src) => (
                          <span key={src} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-cyan-400">
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-white/10 rounded-2xl px-5 py-3 flex gap-1">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-8 z-10">
          <form 
            onSubmit={handleSendMessage}
            className="max-w-4xl mx-auto relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center bg-slate-900 rounded-2xl border border-white/10 p-2 pl-4">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your documents..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`ml-2 p-2 rounded-xl transition ${
                  !input.trim() || isLoading 
                    ? "text-slate-600 bg-slate-800" 
                    : "text-white bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-950/50"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
            </div>
          </form>
          <p className="text-center text-[10px] text-slate-500 mt-4">
            LaunchPilot AI can make mistakes. Verify important information.
          </p>
        </div>
      </main>
    </div>
  );
}
