import Link from 'next/link';
import ListingCard from '@/components/ListingCard';
import { createClient } from '@/lib/supabase-server';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <section className="section container narrow">
        <div className="empty-state stack-sm">
          <h1>Profil</h1>
          <p>Connecte-toi pour accéder à ton espace.</p>
          <Link href="/connexion" className="button primary">Aller à la connexion</Link>
        </div>
      </section>
    );
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: listings } = await supabase
    .from('listings')
    .select('*, profiles(full_name, campus), listing_images(image_url, sort_order)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <section className="section container">
      <div className="card profile-hero">
        <div>
          <h1>{profile?.full_name ?? 'Mon profil'}</h1>
          <p className="muted">{profile?.email ?? user.email}</p>
          <p className="muted">Campus : {profile?.campus ?? 'Non défini'}</p>
        </div>
      </div>
      <div className="section-head">
        <h2>Mes annonces</h2>
        <Link href="/deposer">Déposer une annonce</Link>
      </div>
      <div className="cards-grid">
        {(listings ?? []).map((listing) => <ListingCard key={listing.id} listing={listing} />)}
      </div>
      {(!listings || listings.length === 0) && <div className="empty-state">Tu n’as pas encore publié d’annonce.</div>}
    </section>
  );
}
