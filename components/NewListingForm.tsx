'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function NewListingForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Mobilier');
  const [campus, setCampus] = useState('Paris');
  const [condition, setCondition] = useState('Bon état');
  const [imageUrl, setImageUrl] = useState('');
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
      setMessage('Connecte-toi avant de déposer une annonce.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('listings')
      .insert({
        user_id: user.id,
        title,
        description,
        price: Number(price),
        category,
        campus,
        condition,
        status: 'active'
      })
      .select('id')
      .single();

    if (error || !data) {
      setMessage(error?.message ?? 'Impossible de créer l’annonce.');
      setLoading(false);
      return;
    }

    if (imageUrl) {
      await supabase.from('listing_images').insert({
        listing_id: data.id,
        image_url: imageUrl,
        sort_order: 0
      });
    }

    router.push(`/annonces/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card stack-md">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de l’annonce" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décris ton annonce" rows={6} required />
      <div className="grid-2">
        <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" placeholder="Prix (€)" required />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Mobilier</option>
          <option>Électronique</option>
          <option>Cours</option>
          <option>Logement</option>
          <option>Services</option>
        </select>
      </div>
      <div className="grid-2">
        <select value={campus} onChange={(e) => setCampus(e.target.value)}>
          <option>Paris</option>
          <option>Lyon</option>
          <option>Lille</option>
          <option>Bordeaux</option>
        </select>
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option>Neuf</option>
          <option>Très bon état</option>
          <option>Bon état</option>
          <option>Correct</option>
        </select>
      </div>
      <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL d’image (optionnel)" />
      <button className="button primary" type="submit" disabled={loading}>{loading ? 'Publication...' : 'Publier l’annonce'}</button>
      {message && <p className="notice">{message}</p>}
    </form>
  );
}
