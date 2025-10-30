import { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { role: 'user', text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'API error');
      }

      const data = await res.json();
      const botMsg = { role: 'assistant', text: data.answer || 'No answer', references: data.references || [] };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      sendMessage();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-md shadow p-4 flex flex-col h-[70vh]">
        <h2 className="text-lg font-semibold mb-2">Chatbot</h2>
        <div className="flex-1 overflow-auto mb-3 p-2 space-y-3">
          {messages.length === 0 && (
            <div className="text-sm text-gray-500">Ask a question — the assistant will reply using context from the site.</div>
          )}

          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-3 py-2 max-w-[80%] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}>
                <div className="whitespace-pre-wrap">{m.text}</div>
                {m.references && m.references.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    References:
                    <ul className="list-disc ml-4">
                      {m.references.map((r, i) => (
                        <li key={i}><a className="underline" target="_blank" rel="noreferrer" href={r.link || '#'}>{r.title || r.source || 'source'}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-2">
          <textarea
            rows={3}
            className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-600 bg-transparent"
            placeholder="Type your question. Press Ctrl+Enter (or Cmd+Enter) to send."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={loading}
          />
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
              type="button"
              onClick={() => setInput('')}
              disabled={loading || !input}
            >
              Clear
            </button>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-60"
              onClick={sendMessage}
              disabled={loading || !input}
            >
              {loading ? 'Thinking...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
