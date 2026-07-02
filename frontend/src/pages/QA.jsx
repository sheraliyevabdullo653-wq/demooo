import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Send, Bot, User, AlertCircle, Sparkles, RotateCcw, Settings, X, Key, CheckCircle } from 'lucide-react'
import { mockAIResponses } from '../data'

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/### (.*?)/g, '<h3 class="font-700 text-base mt-2 mb-1">$1</h3>')
    .replace(/\n\n/g, '<div class="h-2"></div>')
    .replace(/\n/g, '<br/>')
    .replace(/^• /gm, '&bull; ')
    .replace(/^\d\. /gm, (match) => `<span class="font-700 text-primary-500">${match}</span>`)
}

export default function QA() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: 'assistant',
      text: "Hello! I'm MediCore AI, your personal health assistant. Ask me any health question — symptoms, medications, wellness tips, and more. How can I help you today?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [provider, setProvider] = useState(localStorage.getItem('medicore_chat_provider') || 'gemini')
  const [apiKey, setApiKey] = useState(localStorage.getItem('medicore_openai_key') || import.meta.env.VITE_OPENAI_API_KEY || '')
  const bottomRef = useRef(null)

  const suggestedQs = [
    t('qa.q1'), t('qa.q2'), t('qa.q3'), t('qa.q4'), t('qa.q5'),
  ]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const saveApiKey = (key) => {
    setApiKey(key)
    localStorage.setItem('medicore_openai_key', key)
  }

  const saveProvider = (p) => {
    setProvider(p)
    localStorage.setItem('medicore_chat_provider', p)
  }

  const askOpenAI = async (question) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '')
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          messages: messages,
          apiKey: apiKey,
          provider: provider,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get response from AI')
      }

      return data.data
    } catch (err) {
      console.error('AI Chat Error:', err)
      if (err.message.includes('quota') || err.message.includes('429')) {
        return `**Xatolik (Limit tugagan):** Siz kiritgan API kalitida mablag' (balans) tugagan yoki kunlik limitga yetgan. Iltimos, [OpenAI Billing](https://platform.openai.com/account/billing) bo'limida balansingizni tekshiring.`
      }
      return `**Xatolik:** ${err.message}. Iltimos, sozlamalarda API sozlamalarini qayta tekshiring.`
    }
  }

  const ask = async (question) => {
    if (!question.trim() || loading) return
    const userMsg = { id: Date.now(), role: 'user', text: question }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    let response
    if (provider === 'gemini' || apiKey) {
      response = await askOpenAI(question)
    } else {
      // Simulate API delay for mock
      await new Promise((r) => setTimeout(r, 1400 + Math.random() * 800))
      const lower = question.toLowerCase()
      if (lower.includes('flu') || lower.includes('influenza') || lower.includes('gripp')) {
        response = mockAIResponses.flu
      } else {
        response = mockAIResponses.default(question)
      }
    }

    setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', text: response }])
    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    ask(input)
  }

  const reset = () => {
    setMessages([{
      id: 0, role: 'assistant',
      text: "Hello! I'm MediCore AI, your personal health assistant. Ask me any health question — symptoms, medications, wellness tips, and more. How can I help you today?",
    }])
    setInput('')
  }

  return (
    <main className="min-h-screen pt-20 flex flex-col mesh-bg relative">
      <div className="noise absolute inset-0 pointer-events-none" />
      <div className="container-max px-4 sm:px-6 lg:px-8 py-8 flex flex-col flex-1 relative z-10 max-w-3xl">

        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display font-800 text-3xl sm:text-4xl text-slate-900 dark:text-white mb-2">{t('qa.title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('qa.subtitle')}</p>
        </motion.div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass rounded-3xl p-6 mb-6 overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-700 text-sm flex items-center gap-2"><Settings size={14} /> AI Assistant Configuration</h3>
                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-red-500"><X size={16} /></button>
              </div>

              {/* Provider Selection */}
              <div className="mb-4">
                <label className="text-[10px] font-800 text-slate-400 dark:text-slate-500 uppercase ml-1 mb-2 block">
                  AI Model Provider
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => saveProvider('gemini')}
                    className={`py-2 px-3 rounded-xl text-xs font-700 transition-all ${
                      provider === 'gemini'
                        ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    Google Gemini (Free)
                  </button>
                  <button
                    type="button"
                    onClick={() => saveProvider('openai')}
                    className={`py-2 px-3 rounded-xl text-xs font-700 transition-all ${
                      provider === 'openai'
                        ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    OpenAI GPT-3.5
                  </button>
                </div>
              </div>

              {provider === 'openai' ? (
                <>
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                    To use **Real-time GPT-3.5**, please provide your OpenAI API key. It is stored locally in your browser.
                  </p>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => saveApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="input-base text-xs font-mono"
                  />
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-500 font-700 uppercase">
                    <CheckCircle size={10} /> Local Storage Protected
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Using high-performance **Google Gemini 2.5 Flash** directly through our secure backend. No keys required!
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Card */}
        <div className="flex-1 glass rounded-3xl mb-4 overflow-hidden flex flex-col border border-slate-200/65 dark:border-slate-800/80 shadow-xl shadow-black/5 dark:shadow-black/20 min-h-[380px]">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-primary-500 flex items-center justify-center shadow-md">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-800 dark:text-slate-200">MediCore AI Assistant</h2>
                <span className="text-[10px] text-emerald-500 font-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {provider === 'gemini' ? 'Gemini 2.5 Flash Online' : 'GPT-3.5 Online'}
                </span>
              </div>
            </div>
            
            <motion.button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2.5 rounded-xl border transition-all ${
                showSettings 
                  ? 'bg-primary-500/10 border-primary-500/20 text-primary-600 dark:text-primary-400' 
                  : 'glass border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Settings"
            >
              <Settings size={16} />
            </motion.button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 max-h-[50vh] sm:max-h-[460px] no-scrollbar">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-violet-500 to-primary-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white rounded-br-md shadow-lg shadow-primary-500/20'
                        : 'glass text-slate-700 dark:text-slate-300 rounded-bl-md'
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                  />
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                      <User size={14} className="text-slate-600 dark:text-slate-400" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <motion.div
                  className="flex gap-3 justify-start"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-violet-500 to-primary-500 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="glass px-5 py-4 rounded-3xl rounded-bl-md">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary-500"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">
                        {provider === 'gemini' ? 'Gemini Thinking...' : 'GPT Thinking...'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
              <Sparkles size={12} /> {t('qa.suggested')}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQs.map((q) => (
                <motion.button
                  key={q}
                  onClick={() => ask(q)}
                  className="px-4 py-2 glass rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('qa.placeholder')}
            disabled={loading}
            className="input-base flex-1"
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary px-5 rounded-2xl disabled:opacity-40"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            <Send size={18} />
          </motion.button>
          <motion.button
            type="button"
            onClick={reset}
            className="btn-secondary px-4 rounded-2xl"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            title="Clear chat"
          >
            <RotateCcw size={16} />
          </motion.button>
        </form>

        {/* Disclaimer */}
        <motion.div
          className="mt-4 flex items-start gap-2 p-4 glass rounded-2xl border border-amber-500/20"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">{t('qa.disclaimer')}</p>
        </motion.div>
      </div>
    </main>
  )
}
