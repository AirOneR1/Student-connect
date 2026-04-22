import ListingCard from '@/components/ListingCard';
import { createClient } from '@/lib/supabase-server';

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <section className="section container"><div className="empty-state">Connecte-toi pour voir tes favoris.</div></section>;
  }

  const { data: favorites } = await supabase
    .from('favorites')
    .select('listing_id, listings(*, profiles(full_name, campus), listing_images(image_url, sort_order))')
    .eq('user_id', user.id);

  const listings = (favorites ?? []).map((item: any) => item.listings).filter(Boolean);

  return (
    <section className="section container">
      <div className="section-head"><h1>Mes favoris</h1></div>
      <div className="cards-grid">
        {listings.map((listing: any) => <ListingCard key={listing.id} listing={listing} />)}
      </div>
      {listings.length === 0 && <div className="empty-state">Tu n’as pas encore de favoris.</div>}
    </section>
  );
}
