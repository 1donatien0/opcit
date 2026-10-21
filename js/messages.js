// Phrases affichées par la liste de tâches.

function messageListeVide(filtre) {
  const messages = {
    toutes: "Aucune tâche pour le moment",
    actives: "Rien à faire pour l'instant",
    terminees: "Pas encore de tâche terminée",
  };
  return messages[filtre] || messages.toutes;
}

function texteCompteur(restantes) {
  if (restantes === 0) return "Tout est fait";
  const pluriel = restantes > 1 ? "s" : "";
  return `${restantes} tâche${pluriel} restante${pluriel}`;
}
