import NewListingForm from '@/components/NewListingForm';

export default function PostListingPage() {
  return (
    <section className="section container narrow">
      <div className="section-head">
        <h1>Déposer une annonce</h1>
        <p className="muted">Le formulaire enregistre directement l’annonce dans la base de données.</p>
      </div>
      <NewListingForm />
    </section>
  );
}
