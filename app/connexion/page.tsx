import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <section className="section container narrow">
      <div className="section-head">
        <h1>Connexion / inscription</h1>
        <p className="muted">Authentification gérée par Supabase Auth.</p>
      </div>
      <AuthForm />
    </section>
  );
}
