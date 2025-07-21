import { Link } from "react-router";

export default function Erreur() {
  return (
    <div className="erreur-page">
      <h1>404</h1>
      <p>Oups ! Cette page est introuvable.</p>
      <Link to="/" className="erreur-button">
        ⬅️ Retour à l'accueil
      </Link>
    </div>
  );
}
