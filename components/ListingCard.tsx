import Link from 'next/link';
import { Listing } from '@/lib/types';
import { formatDate, formatPrice } from '@/lib/utils';

const defaultImage = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';

export default function ListingCard({ listing }: { listing: Listing }) {
  const image = listing.listing_images?.[0]?.image_url ?? defaultImage;

  return (
    <article className="listing-card">
      <Link href={`/annonces/${listing.id}`}>
        <img src={image} alt={listing.title} className="listing-card-image" />
      </Link>
      <div className="listing-card-content">
        <div className="listing-meta-row">
          <span className="badge">{listing.category}</span>
          <span className="muted">{listing.campus}</span>
        </div>
        <h3>
          <Link href={`/annonces/${listing.id}`}>{listing.title}</Link>
        </h3>
        <p className="price">{formatPrice(listing.price)}</p>
        <p className="muted clamp-2">{listing.description}</p>
        <div className="listing-footer">
          <span>{listing.profiles?.full_name ?? 'Étudiant'}</span>
          <span>{formatDate(listing.created_at)}</span>
        </div>
      </div>
    </article>
  );
}
