# Backend - AWS Serverless Architecture

Tento projekt využíva moderný **Serverless** prístup postavený na službách Amazon Web Services (AWS).

### 💡 Prečo AWS Serverless?
Pre tento projekt som sa rozhodol zvoliť cloudový prístup namiesto tradičného servera. Bola to moja prvá skúsenosť s prácou v tomto ekosystéme.
* **Developer Experience:** Práca s dátami mi pripomína prácu s **Prismou v Next.js** – je to intuitívne a rýchle, akonáhle je všetko nastavené.
* **Konfigurácia:** I keď počiatočná konfigurácia infraštruktúry v AWS je zložitejšia než pri bežnom REST API, výsledkom je škálovateľné riešenie bez nutnosti spravovať servery.

### 🛠 Použité technológie
* **AWS AppSync:** Spravuje GraphQL API (namiesto tradičného REST).
* **AWS Lambda:** Serverless funkcie (Node.js), ktoré obsahujú biznis logiku.
* **Amazon DynamoDB:** NoSQL databáza pre ukladanie inzerátov a kategórií.

---

## 🚀 Postup spustenia projektu

Keďže ide o serverless architektúru, backend beží neustále v cloude. Lokálne súbory slúžia na správu a nasadzovanie zmien.

**Prerekvizity:**
* Node.js (v18+)
* AWS CLI (nakonfigurované s prístupovými kľúčmi)

**Nasadenie zmien (Deploy):**
Ak upravíte kód Lambda funkcií v priečinku `lambda/`, zmeny nasadíte pomocou pripraveného skriptu:

```bash
cd scripts
./deploy-lambda.sh

### 2. `frontend/README.md`

```markdown
# Frontend - React Announcements App

Klientská časť aplikácie pre správu inzerátov, postavená na moderných webových technológiách s dôrazom na UX a čistý dizajn.

### 🛠 Tech Stack
* **Framework:** React + Vite (TypeScript)
* **UI Knižnica:** Shadcn/ui + Tailwind CSS
* **Backend integrácia:** AWS Amplify (Gen 2)
* **Formuláre:** React Hook Form + Zod (validácia)

---

## ✨ Realizované funkcionality

Aplikácia momentálne podporuje tieto kľúčové funkcie:

1.  **Zoznam inzerátov (Data Table):**
    * Prehľadná tabuľka zobrazujúca názov, dátum publikácie a kategórie.
    * Responzívny dizajn s horizontálnym scrollovaním na menších zariadeniach.
    * Optimalizovaný scrollbar pre moderný vzhľad.

2.  **CRUD Operácie:**
    * **Vytvorenie:** Formulár s validáciou, výberom viacerých kategórií a dátumu.
    * **Editácia:** Možnosť upraviť existujúce údaje inzerátu.
    * **Mazanie:** Bezpečné mazanie s potvrdzovacím modálnym oknom.

3.  **Dark / Light Mode:**
    * Plná podpora prepínania tém (Svetlá / Tmavá / Systémová).
    * Stav témy sa ukladá a rešpektuje nastavenia operačného systému.

---

## 🚀 Postup spustenia

1.  **Inštalácia závislostí:**
    Prejdite do priečinka frontend a nainštalujte balíčky:
    ```bash
    npm install
    ```

2.  **Konfigurácia prostredia (.env):**
    Vytvorte súbor `.env` v koreňovom priečinku `frontend/` a doplňte údaje z AWS AppSync:
    ```env
    VITE_API_URL=[https://vasa-api-url.appsync-api.eu-north-1.amazonaws.com/graphql](https://vasa-api-url.appsync-api.eu-north-1.amazonaws.com/graphql)
    VITE_API_KEY=da2-vas-api-kluc
    VITE_AWS_REGION=eu-north-1
    ```

3.  **Spustenie vývojového servera:**
    ```bash
    npm run dev
    ```
    Aplikácia bude dostupná na `http://localhost:5173`.

---