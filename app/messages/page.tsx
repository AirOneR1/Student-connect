import { createClient } from '@/lib/supabase-server';
import { formatDate } from '@/lib/utils';

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <section className="section container"><div className="empty-state">Connecte-toi pour consulter tes messages.</div></section>;
  }

  const { data: messages } = await supabase
    .from('messages')
    .select('*, listings(title), sender:profiles!messages_sender_id_fkey(full_name), receiver:profiles!messages_receiver_id_fkey(full_name)')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  return (
    <section className="section container">
      <div className="section-head"><h1>Messagerie</h1></div>
      <div className="stack-md">
        {(messages ?? []).map((message: any) => (
          <article key={message.id} className="card stack-xs">
            <strong>{message.listings?.title ?? 'Conversation libre'}</strong>
            <span className="muted">De {message.sender?.full_name ?? 'Étudiant'} à {message.receiver?.full_name ?? 'Étudiant'}</span>
            <p>{message.content}</p>
            <span className="muted">{formatDate(message.created_at)}</span>
          </article>
        ))}
      </div>
      {(!messages || messages.length === 0) && <div className="empty-state">Aucun message pour le moment.</div>}
    </section>
  );
}
