'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function FavoriteButton({ listingId, initialFavorite }: { listingId: string; initialFavorite: boolean }) {
  const [favorite, setFavorite] = useState(initialFavorite);
  const [message, setMessage] = useState('');

  async function toggleFavorite() {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;

    if (!user) {
      setMessage('Connecte-toi pour ajouter des favoris.');
      return;
    }

    if (favorite) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('listing_id', listingId);
      setFavorite(false);
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, listing_id: listingId });
      setFavorite(true);
    }
  }

  return (
    <div className="stack-xs">
      <button type="button" className="button ghost" onClick={toggleFavorite}>
        {favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      </button>
      {message && <span className="muted">{message}</span>}
    </div>
  );
}
