import FavoriteButton from '@/components/FavoriteButton';
import MessageForm from '@/components/MessageForm';
import { createClient } from '@/lib/supabase-server';
import { formatDate, formatPrice } from '@/lib/utils';

const defaultImage = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: listing } = await supabase
    .from('listings')
    .select('*, profiles(full_name, campus), listing_images(image_url, sort_order)')
    .eq('id', id)
    .single();

  if (!listing) {
    return <section className="section container"><div className="empty-state">Annonce introuvable.</div></section>;
  }

  const { data: favorite } = user
    ? await supabase.from('favorites').select('id').eq('user_id', user.id).eq('listing_id', id).maybeSingle()
    : { data: null };

  return (
    <section className="section container detail-grid">
      <div>
        <img src={listing.listing_images?.[0]?.image_url ?? defaultImage} alt={listing.title} className="detail-image" />
      </div>
      <div className="stack-md">
        <div className="listing-meta-row">
          <span className="badge">{listing.category}</span>
          <span className="badge muted-badge">{listing.condition}</span>
          <span className="badge muted-badge">{listing.campus}</span>
        </div>
        <h1>{listing.title}</h1>
        <p className="price big">{formatPrice(listing.price)}</p>
        <p>{listing.description}</p>
        <div className="card stack-sm">
          <strong>Publié par {listing.profiles?.full_name ?? 'Étudiant'}</strong>
          <span className="muted">Campus : {listing.profiles?.campus ?? listing.campus}</span>
          <span className="muted">Publié le {formatDate(listing.created_at)}</span>
        </div>
        <FavoriteButton listingId={listing.id} initialFavorite={Boolean(favorite)} />
        {user?.id !== listing.user_id && <MessageForm receiverId={listing.user_id} listingId={listing.id} />}
      </div>
    </section>
  );
}
