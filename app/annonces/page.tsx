import ListingCard from '@/components/ListingCard';
import { createClient } from '@/lib/supabase-server';

export default async function ListingsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; campus?: string; category?: string }>;
}) {
  const { q = '', campus = '', category = '' } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('listings')
    .select('*, profiles(full_name, campus), listing_images(image_url, sort_order)')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  if (campus) query = query.eq('campus', campus);
  if (category) query = query.eq('category', category);

  const { data: listings } = await query;

  return (
    <section className="section container">
      <div className="section-head stack-sm">
        <h1>Annonces étudiantes</h1>
        <p className="muted">Résultats dynamiques depuis Supabase.</p>
      </div>
      <div className="cards-grid">
        {(listings ?? []).map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      {(!listings || listings.length === 0) && <div className="empty-state">Aucune annonce trouvée.</div>}
    </section>
  );
}
