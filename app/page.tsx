import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import ListingCard from '@/components/ListingCard';
import SearchBar from '@/components/SearchBar';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: listings } = await supabase
    .from('listings')
    .select('*, profiles(full_name, campus), listing_images(image_url, sort_order)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Marketplace étudiante</p>
            <h1>Acheter, vendre et s’entraider entre étudiants.</h1>
            <p className="lead">Student Connect reprend l’esprit d’une plateforme de petites annonces, mais pensée pour les campus : mobilier, colocs, cours, services, électronique et bons plans.</p>
            <div className="hero-actions">
              <Link href="/annonces" className="button primary">Voir les annonces</Link>
              <Link href="/deposer" className="button ghost">Déposer une annonce</Link>
            </div>
          </div>
          <div className="hero-card">
            <SearchBar />
            <div className="stats-grid">
              <div><strong>100%</strong><span>campus</span></div>
              <div><strong>24/7</strong><span>annonces</span></div>
              <div><strong>1</strong><span>compte étudiant</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>Dernières annonces</h2>
          <Link href="/annonces">Tout voir</Link>
        </div>
        <div className="cards-grid">
          {(listings ?? []).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </>
  );
}
