# PRD --- Argent Noki-Noki

## MVP : Simulateur de transfert Congo → Dakar

------------------------------------------------------------------------

## 1. Présentation du projet

### Nom du projet

**Argent Noki-Noki**

### Secteur

Fintech -- Transfert d'argent international.

### Mission

Permettre aux personnes vivant au Congo-Brazzaville d'envoyer rapidement
de l'argent à leurs proches à Dakar avec une tarification simple et
transparente.

------------------------------------------------------------------------

## 2. Vision produit

> J'indique combien j'envoie et je sais immédiatement combien mon proche
> reçoit.

------------------------------------------------------------------------

## 3. Objectif du MVP

1.  Simuler un transfert.
2.  Afficher les frais.
3.  Rassurer les utilisateurs.
4.  Générer des demandes de transfert.

------------------------------------------------------------------------

## 4. Fonctionnalités

-   Simulateur de transfert.
-   Calcul automatique des frais.
-   Affichage du montant reçu.
-   Grille tarifaire.
-   Bouton WhatsApp.
-   FAQ.

------------------------------------------------------------------------

## 5. Grille tarifaire

  ------------------------------------------------------------------------
   Vous envoyez   Commission  Frais Mobile Money  Total payé  Montant reçu
  ------------- ------------ ------------------- ----------- -------------
         10 000        1 150                 390      10 390        11 150

         50 000        5 750               2 029      52 029        55 750

        100 000       11 500               3 903     103 903       111 500

        200 000       23 000               5 575     205 575       223 000

        500 000       57 500              13 380     513 380       557 500
  ------------------------------------------------------------------------

------------------------------------------------------------------------

## 6. Règles métier

-   Commission : 11,5 %.
-   Montant reçu = Montant envoyé + commission.
-   Total payé = Montant envoyé + frais Mobile Money.

------------------------------------------------------------------------

## 7. KPI

-   Nombre de simulations.
-   Nombre de transferts.
-   Taux de conversion.
-   Clics WhatsApp.

------------------------------------------------------------------------

## 8. Stack technique

-   Next.js / Nuxt / React
-   Tailwind CSS
-   Vercel

------------------------------------------------------------------------

## 9. Critères de succès

-   Compréhension immédiate des tarifs.
-   Utilisation régulière du simulateur.
-   Augmentation des transferts.
-   Réduction du temps d'explication des agents.
