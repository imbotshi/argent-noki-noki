# 🎯 PRD Discovery — Argent Noki-Noki
## 20 Questions UX pour Cadrer le Produit

> **Contexte :** Je suis en phase de discovery UX pour le MVP "Argent Noki-Noki", un simulateur de transfert d'argent Congo → Dakar. Avant d'écrire une seule ligne de code ou de pixel, j'ai besoin que tu répondes à ces 20 questions. Elles vont m'aider à comprendre exactement comment le site doit se comporter, comment parler à tes utilisateurs, et quelles priorités donner à chaque écran.

---

## 🧑‍🤝‍🧑 A. Utilisateurs & Contexte d'Usage

**Q1. Qui est l'utilisateur principal ?**
Est-ce que c'est plutôt :
- (a) la personne **au Congo** qui envoie l'argent
- (b) la personne **à Dakar** qui reçoit l'argent
- (c) les deux indifféremment

Et quel est son niveau de familiarité avec les apps fintech (débutant, intermédiaire, avancé) ?

---

**Q2. Sur quel appareil l'utilisateur va-t-il principalement utiliser le site ?**
- Mobile uniquement
- Desktop uniquement
- Les deux (indiquer le % principal)

→ *Cela détermine la priorité de la mise en page et des interactions tactiles.*

---

**Q3. Quel est le contexte émotionnel de l'utilisateur quand il arrive sur le site ?**
Est-ce qu'il est :
- Stressé (urgence, besoin immédiat)
- Confiant (il connaît déjà le service)
- Méfiant (première visite, peu de confiance envers les services en ligne)

→ *Ce contexte va définir le ton et les éléments rassurants à mettre en avant.*

---

**Q4. Dans quelle langue(s) les utilisateurs sont-ils le plus à l'aise ?**
- Français uniquement
- Français + Lingala
- Français + Wolof (côté Dakar)
- Les trois

---

## 💸 B. Le Simulateur — Cœur du Produit

**Q5. Comment l'utilisateur saisit-il le montant à envoyer ?**
Quelle est ta préférence :
- (a) Un **champ de saisie libre** où il tape n'importe quel montant
- (b) Des **boutons de montants prédéfinis** (10 000, 50 000, 100 000 FCFA...) avec possibilité d'en saisir un autre
- (c) Un **slider** (curseur à glisser)

---

**Q6. Quelle est l'unité monétaire affichée côté Congo ?**
- XAF (Franc CFA CEMAC) avec le symbole "FCFA"
- CDF (Franc Congolais)
- Les deux avec possibilité de basculer

---

**Q7. Veut-on afficher le taux de change (XAF → XOF ou FCFA) ?**
- Oui, afficher explicitement le taux et le montant reçu en FCFA côté Dakar
- Non, juste afficher le montant reçu en chiffres sans détailler le change
- Le montant reçu s'affiche dans la même devise (pas de conversion)

---

**Q8. Quel est le comportement du simulateur en temps réel ?**
- Les résultats s'affichent **immédiatement** dès que l'utilisateur tape (sans bouton "Calculer")
- L'utilisateur tape puis clique sur un **bouton "Simuler"** pour voir le résultat
- Résultat visible au bas d'un formulaire après validation

---

**Q9. Quels sont les éléments exacts à afficher dans le résultat du simulateur ?**
D'après ton PRD, il y a : Commission, Frais Mobile Money, Total payé, Montant reçu.
- Faut-il afficher **tous** ces champs toujours ?
- Ou simplifier pour le MVP et afficher seulement **"Vous payez : X" et "Votre proche reçoit : Y"** ?
- Un affichage avancé / détail dépliable ?

---

**Q10. Y a-t-il un montant minimum et/ou maximum pour un transfert ?**
- Montant minimum autorisé : ?
- Montant maximum autorisé : ?
- Message d'erreur si l'utilisateur saisit en dehors de ces limites ?

---

## 📱 C. Bouton WhatsApp & Conversion

**Q11. Que se passe-t-il quand l'utilisateur clique sur le bouton WhatsApp ?**
- Il est redirigé vers un numéro WhatsApp pré-défini avec un **message pré-rempli** contenant les détails de sa simulation (montant, frais, etc.)
- Il est redirigé vers WhatsApp sans message pré-rempli
- Quel est le numéro WhatsApp de l'agent ?

---

**Q12. Le bouton WhatsApp est-il toujours visible, ou seulement après que l'utilisateur a fait une simulation ?**
- Toujours visible (Call-to-Action permanent en haut de page ou flottant)
- Visible seulement une fois qu'un résultat de simulation est affiché
- Les deux (un permanent + un contextuel après simulation)

---

## 🎨 D. Identité Visuelle & Ton Éditorial

**Q13. Quel est le registre de ton ("voice & tone") que tu veux pour le site ?**
Choisis 3 mots parmi :
- Chaleureux / Sérieux / Familier / Professionnel / Simple / Moderne / Local / Rassurant / Rapide / Transparent

→ *Ces mots vont définir comment j'écris les textes (titres, boutons, messages d'erreur).*

---

**Q14. Y a-t-il déjà un logo ou une identité de marque pour "Argent Noki-Noki" ?**
- Oui → Merci de partager les couleurs, polices ou le logo
- Non → Je dois proposer une palette de couleurs et une typographie de A à Z

---

**Q15. Quelle ambiance visuelle souhaites-tu ?**
- Moderne & minimaliste (style Revolut, Lydia)
- Chaud & africain (couleurs vives, illustrations locales)
- Sérieux & institutionnel (style banque)
- Mix chaud + moderne

---

## 🗺 E. Architecture & Navigation

**Q16. Quelle est la structure de page que tu envisages pour le MVP ?**
- Une **seule page** (one-page scroll) avec toutes les sections : Simulateur → Grille tarifaire → FAQ → WhatsApp
- Plusieurs pages (Accueil, Simulateur, FAQ, Contact)
- Landing page avec le simulateur en hero, et des sections en dessous sur la même page

---

**Q17. La FAQ est-elle obligatoire dans le MVP ?**
- Oui, avec quelles questions précises ?
- Non, on l'ajoutera dans la v2
- Quelques lignes de FAQ intégrées directement dans la page (sans page dédiée)

---

## 🔒 F. Confiance & Réassurance

**Q18. Quels éléments de réassurance sont prioritaires pour tes utilisateurs ?**
En termes de crédibilité, classe par ordre de priorité :
- Témoignages de clients satisfaits
- Nombre de transferts effectués (social proof)
- Logo / certifications / mentions légales
- Garantie de rapidité ("Transfert en moins de X heures")
- Politique de confidentialité visible

---

**Q19. Y a-t-il une garantie ou une promesse spécifique à mettre en avant sur le site ?**
Par exemple :
- "Transfert garanti en 24h"
- "Zéro frais cachés"
- "Taux transparent et fixe"
- Autre : ...

---

## 🚀 G. Lancement & Priorité

**Q20. Quelle est la date cible pour que le MVP soit en ligne, et quelle est la seule chose que ce site DOIT réussir à faire faire à l'utilisateur ?**
Si tu ne pouvais garder qu'**une seule action utilisateur** pour mesurer le succès du MVP, laquelle choisirais-tu :
- (a) Faire au moins **une simulation** de transfert
- (b) Cliquer sur le **bouton WhatsApp** pour contacter un agent
- (c) Comprendre les **tarifs** sans avoir à demander

---

> ✍️ **Instructions :** Réponds à ces questions dans l'ordre ou par priorité. Plus tes réponses sont précises, plus le site final sera juste du premier coup — sans va-et-vient. Si une question ne s'applique pas encore, indique simplement "À définir".
