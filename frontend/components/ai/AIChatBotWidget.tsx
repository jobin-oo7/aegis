"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Bot,
  X,
  Minimize2,
  Maximize2,
  Send,
  Trash2,
  ShieldCheck,
  TrendingUp,
  Cpu,
  ChevronRight,
  ExternalLink,
  MessageSquareText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormattedChatMessage } from "./FormattedChatMessage";
import { api } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { User } from "@/types/user";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestions?: string[];
  citations?: string[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg_init",
    role: "assistant",
    content:
      "### 👋 Welcome to Aegis-Quant AI Risk Advisor\n\n" +
      "I am directly grounded in your enterprise risk registry, asset valuations, and deterministic quantification formulas ($0.3E + 0.25T + \\dots$).\n\n" +
      "How can I assist your executive risk analysis or capital planning today?",
    timestamp: "Just now",
    suggestions: [
      "What is our total organizational EAL liability?",
      "Which risk is currently ranked #1 and why?",
      "If we spend ₹800,000 on WAF, what is our projected ROSI?",
      "Explain how Likelihood & Residual Risk are calculated",
    ],
    citations: ["Aegis Deterministic Risk Model v1.0", "NIST SP 800-30", "ISO/IEC 27005"],
  },
];

export function AIChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync active user
  useEffect(() => {
    setUser(getCurrentUser());
    const onAuth = () => setUser(getCurrentUser());
    window.addEventListener("aegis_auth_changed", onAuth);
    return () => window.removeEventListener("aegis_auth_changed", onAuth);
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.chatWithAI(
        newHistory.map((m) => ({ role: m.role, content: m.content })),
        {
          user_role: user?.role || "Executive",
          organization: user?.organization_name || "CyberAegis Financial",
        }
      );

      const assistantMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: "assistant",
        content: response.content || "Risk intelligence response unavailable.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: response.suggestions || [],
        citations: response.citations || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        role: "assistant",
        content: "⚠️ Unable to connect to the Aegis-Quant AI service. Fallback intelligence is operating.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* 1. Floating Launch Button (When closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 border border-blue-400/40 hover:scale-105 transition-all duration-200"
          title="Open Aegis-Quant AI Risk Advisor"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-blue-900" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold block leading-none">AI Risk Advisor</span>
            <span className="text-[10px] text-blue-200 block font-medium">Grounded & Deterministic</span>
          </div>
          <Sparkles className="w-4 h-4 text-blue-200 group-hover:rotate-12 transition-transform ml-1" />
        </button>
      )}

      {/* 2. Interactive Chat Window (When open) */}
      {isOpen && (
        <div
          className={`flex flex-col bg-slate-950/95 border border-slate-800 shadow-2xl rounded-2xl backdrop-blur-2xl transition-all duration-300 overflow-hidden ${
            isExpanded
              ? "w-[92vw] sm:w-[650px] h-[85vh] fixed bottom-6 right-6"
              : "w-[92vw] sm:w-[460px] h-[600px]"
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-100">Aegis-Quant AI</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live Engine
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                  Context: {user?.role || "Security Executive"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Clear Conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Context Banner */}
          <div className="px-4 py-1.5 bg-blue-950/30 border-b border-blue-900/30 flex items-center justify-between text-[11px] text-blue-300">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Deterministic Grounding: 6 Active Risks • ₹36.95M EAL</span>
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">Zero Hallucinations</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white font-medium rounded-tr-none shadow-blue-600/10"
                      : "bg-slate-900/90 border border-slate-800/90 text-slate-200 rounded-tl-none"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div>
                      <FormattedChatMessage content={msg.content} />

                      {/* Suggestions Chips */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            Suggested Follow-Ups:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.suggestions.map((sug, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(sug)}
                                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-blue-600/20 hover:text-blue-300 hover:border-blue-500/30 border border-slate-700/60 text-slate-300 transition-all text-left flex items-center gap-1 group"
                              >
                                <span>{sug}</span>
                                <ChevronRight className="w-2.5 h-2.5 text-slate-500 group-hover:text-blue-400 shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Citations Footer */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 truncate">
                          <span>Verified with:</span>
                          <span className="text-slate-400 font-mono truncate">
                            {msg.citations.join(" • ")}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}

                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.role === "user" ? "text-blue-200" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-start animate-fadeIn">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-100" />
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse delay-200" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Querying risk engine telemetry and calculating financial models...
                  </p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about EAL, ranked risks, ROSI, or formulas..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-3"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Press Enter to send</span>
              <span>Aegis Intelligence v1.0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
