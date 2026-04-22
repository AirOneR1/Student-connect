'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function MessageForm({ receiverId, listingId }: { receiverId: string; listingId: string }) {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;

    if (!user) {
      setMessage('Connecte-toi pour envoyer un message.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: receiverId,
      listing_id: listingId,
      content
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Message envoyé.');
      setContent('');
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="stack-sm card">
      <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="Bonjour, ton annonce m’intéresse…" required />
      <button type="submit" className="button primary" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer un message'}</button>
      {message && <p className="notice">{message}</p>}
    </form>
  );
}
