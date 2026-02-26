# 🚀 Join Project (Version 1.0)
> Basierend auf der offiziellen Figma-Vorlage v1.0.

Willkommen beim **Join Project**! Dieses Repository ist der zentrale Knotenpunkt für unsere Entwicklung. Unser Ziel ist eine pixelgenaue Umsetzung des Designs bei gleichzeitig hoher Code-Qualität.

---

## 💻 Tech Stack
Wir setzen diese Anwendung mit einem modernen Vanilla-JS-Ansatz um:
* **HTML5** – Semantische Struktur.
* **CSS3** – Styling und Layout (getreu dem Figma-Design).
* **JavaScript (ES6+)** – Kernlogik und Interaktivität.
* **JSDoc** – Zur standardisierten Dokumentation unseres Codes.

---

## 📡 Kommunikation & Daily Stand-up
Um synchron zu bleiben und Reibungsverluste zu vermeiden, nutzen wir eine feste Routine.

### 💬 Discord Routine
Jedes Teammitglied postet täglich einen **Stand-up-Status** im entsprechenden Discord-Kanal. 

**Dein Post sollte folgende Punkte enthalten:**
1.  ✅ **Zuletzt erledigt:** Was habe ich als Letztes abgeschlossen?
2.  📅 **Heute:** Woran arbeite ich heute konkret?
3.  ⏳ **Zeitaufwand:** Wie viel Zeit plane ich heute für das Projekt ein?
4.  ❓ **Fragen/Blocker:** Gibt es Probleme oder Fragen, die mich aufhalten?

---

## 📂 Organisation & Tools
* **Aufgaben-Management:** Wir nutzen [Trello].
    * Picke dir eigenständig Aufgaben aus dem "Backlog".
    * Verschiebe sie während der Bearbeitung nach "In Progress".
* **Discord:** Schau regelmäßig für Updates und schnelle Absprachen rein.

---

## 🌿 Branching-Strategie
Damit unser Code stabil bleibt, halten wir uns an dieses System:

1.  **Individual Branches:** Die Aktuelle aufgabe wird meist in deiner Branch bearbeitet.
2.  **Tester Branch:** Sobald dein Feature fertig und lokal getestet ist, mergest du es in den `tester`-Branch.
3.  **Main/Production:** Nur stabiler und geprüfter Code vom `tester`-Branch wird final in den `main` gemergt.

> [!IMPORTANT]
> **Vermeide direktes Mergen in den `main` Branch!** Nutze immer zuerst den `tester`-Branch für die Integration.

---

## 🚀 Erste Schritte
Um lokal an dem Projekt zu arbeiten, kannst du es einfach klonen:

```bash
git clone [DEIN-REPO-LINK]
