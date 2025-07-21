import { useNavigate } from "react-router";

export default function Instructions() {
  const navigate = useNavigate();

  const goToChasse = () => {
    navigate("/chasse");
  };

  return (
    <div className="instructions-page">
      <h1 className="instructions-title">
        Instructions de la Chasse au Street Art
      </h1>
      <p className="instructions-text">
        Bienvenue dans la chasse au Street Art ! Voici comment jouer :
      </p>
      <ul className="instructions-list">
        <li>
          📸 Explore la ville et utilise ton appareil photo pour capturer des
          oeuvres de street art.
        </li>
        <li>🏆 Chaque photo te rapporte des points visibles sur ton profil.</li>
        <li>
          🔥 Publie aussi tes propres créations artistiques si tu es un street
          artiste !
        </li>
        <li>
          🌍 Un classement des meilleurs chasseurs sera bientôt disponible.
        </li>
      </ul>

      <button
        type="button"
        onClick={goToChasse}
        className="start-chasse-button"
      >
        Commencer la Chasse
      </button>
    </div>
  );
}
