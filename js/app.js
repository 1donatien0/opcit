// Opcit – petite application de liste de tâches
// Les tâches sont sauvegardées dans le localStorage du navigateur.

const CLE = "opcit-taches";

const formulaire = document.getElementById("formulaire");
const saisie = document.getElementById("saisie");
const liste = document.getElementById("liste");
const compteur = document.getElementById("compteur");
const boutonEffacer = document.getElementById("effacer");
const boutonsFiltre = document.querySelectorAll(".filtres button");

let taches = charger();
let filtre = "toutes";

function charger() {
  try {
    return JSON.parse(localStorage.getItem(CLE)) || [];
  } catch {
    return [];
  }
}

function sauvegarder() {
  try {
    localStorage.setItem(CLE, JSON.stringify(taches));
  } catch {
    /* stockage indisponible : on continue sans sauvegarder */
  }
}

function ajouter(texte) {
  taches.push({ id: Date.now(), texte, terminee: false });
  mettreAJour();
}

function basculer(id) {
  const tache = taches.find((t) => t.id === id);
  if (tache) tache.terminee = !tache.terminee;
  mettreAJour();
}

function supprimer(id) {
  taches = taches.filter((t) => t.id !== id);
  mettreAJour();
}

function renommer(id, texte) {
  const tache = taches.find((t) => t.id === id);
  const propre = texte.trim();
  if (tache && propre) tache.texte = propre;
  mettreAJour();
}

function commencerEdition(tache, span) {
  const champ = document.createElement("input");
  champ.type = "text";
  champ.value = tache.texte;
  champ.className = "edition";
  span.replaceWith(champ);
  champ.focus();

  let termine = false;
  const finir = (enregistrer) => {
    if (termine) return;
    termine = true;
    if (enregistrer) renommer(tache.id, champ.value);
    else afficher();
  };

  champ.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finir(true);
    }
    if (e.key === "Escape") finir(false);
  });
  champ.addEventListener("blur", () => finir(true));
}

function tachesFiltrees() {
  if (filtre === "actives") return taches.filter((t) => !t.terminee);
  if (filtre === "terminees") return taches.filter((t) => t.terminee);
  return taches;
}

function afficher() {
  liste.innerHTML = "";
  const visibles = tachesFiltrees();

  if (visibles.length === 0) {
    const vide = document.createElement("li");
    vide.className = "vide";
    vide.textContent = messageListeVide(filtre);
    liste.appendChild(vide);
  }

  for (const tache of visibles) {
    const li = document.createElement("li");
    if (tache.terminee) li.classList.add("terminee");

    const case_ = document.createElement("input");
    case_.type = "checkbox";
    case_.checked = tache.terminee;
    case_.addEventListener("change", () => basculer(tache.id));

    const texte = document.createElement("span");
    texte.textContent = tache.texte;
    texte.title = "Double-clic pour modifier";
    texte.addEventListener("dblclick", () => commencerEdition(tache, texte));

    const btn = document.createElement("button");
    btn.className = "supprimer";
    btn.title = "Supprimer";
    btn.textContent = "✕";
    btn.addEventListener("click", () => supprimer(tache.id));

    li.append(case_, texte, btn);
    liste.appendChild(li);
  }

  const restantes = taches.filter((t) => !t.terminee).length;
  compteur.textContent = texteCompteur(restantes);
}

function mettreAJour() {
  sauvegarder();
  afficher();
}

formulaire.addEventListener("submit", (e) => {
  e.preventDefault();
  const texte = saisie.value.trim();
  if (texte) ajouter(texte);
  saisie.value = "";
  saisie.focus();
});

boutonEffacer.addEventListener("click", () => {
  taches = taches.filter((t) => !t.terminee);
  mettreAJour();
});

boutonsFiltre.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsFiltre.forEach((b) => b.classList.remove("actif"));
    bouton.classList.add("actif");
    filtre = bouton.dataset.filtre;
    afficher();
  });
});

afficher();
