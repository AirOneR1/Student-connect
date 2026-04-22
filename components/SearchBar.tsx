export default function SearchBar() {
  return (
    <form action="/annonces" className="search-panel">
      <input name="q" placeholder="Que recherches-tu sur le campus ?" />
      <select name="campus" defaultValue="">
        <option value="">Tous les campus</option>
        <option value="Paris">Paris</option>
        <option value="Lyon">Lyon</option>
        <option value="Lille">Lille</option>
        <option value="Bordeaux">Bordeaux</option>
      </select>
      <select name="category" defaultValue="">
        <option value="">Toutes les catégories</option>
        <option value="Logement">Logement</option>
        <option value="Cours">Cours</option>
        <option value="Mobilier">Mobilier</option>
        <option value="Électronique">Électronique</option>
        <option value="Services">Services</option>
      </select>
      <button type="submit" className="button primary">Rechercher</button>
    </form>
  );
}
