import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">Student Connect</Link>
        <nav className="main-nav">
          <Link href="/annonces">Annonces</Link>
          <Link href="/deposer">Déposer</Link>
          <Link href="/favoris">Favoris</Link>
          <Link href="/messages">Messages</Link>
          <Link href="/profil">Profil</Link>
          {user ? <Link href="/profil" className="button ghost">Mon compte</Link> : <Link href="/connexion" className="button ghost">Connexion</Link>}
        </nav>
      </div>
    </header>
  );
}
