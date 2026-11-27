# Rules.md: regole del progetto 'Monochrome New Tab' (`monochromenewtab`)

> **Cos'è questo file.** Il testo completo delle regole di **Monochrome New Tab**, l'estensione
> che rende la scheda nuova un colore solo. Le regole trasversali vivono nell'hub (repo
> `Roccobot/roccobot.github.io`), quelle universali in `rules/Roccobot.md` di `Roccobot/tools`.
> Vale per **tutti gli agenti**: il nucleo, cioè ogni regola in una riga, vive in `AGENTS.md`, e
> questo file ne dà il perché. Nessun agente lo carica da sé: si legge per intero prima di
> lavorare su una cosa di cui parla.

## 🧭 Che cos'è

Un'estensione Manifest V3 che sostituisce la scheda nuova (`chrome_url_overrides.newtab`) con una
pagina vuota di un colore solo: quello della barra degli strumenti, scelto da Rocco nelle opzioni,
uno per il modo chiaro e uno per lo scuro. Nasce il 2026-11-25 su sua richiesta ('modifica'),
dopo un prospetto di ricerca; il browser principale è **Vivaldi**, e funziona anche in Chrome.

- **Perché i colori si scelgono a mano**: nessuna API pubblica di Chromium o di Vivaldi dice a
  un'estensione il colore della barra o il tema attivo. Un programma nativo che leggesse il file
  Preferences di Vivaldi resta una possibile evoluzione, scartata per la 0.10 (scelta di Rocco).
- **Il chiaro e lo scuro li sceglie `prefers-color-scheme`**: in Vivaldi segue 'Website
  Appearance', che su Auto va col sistema operativo; Rocco ha la pianificazione dei temi di Vivaldi
  'secondo il sistema operativo', quindi tema e pagina cambiano insieme.
- **In Vivaldi serve un passo a mano**: Settings, Tabs, New Tab Page, 'Start Page' e 'Controlled
  by Extension'. Per questo le opzioni si aprono da sole alla prima installazione e lo spiegano.
- **Niente `theme-color`**: con 'Accent from page' attivo Vivaldi colorerebbe l'interfaccia col
  colore della pagina, e la scheda nuova non deve cambiare il tema.
- **Niente funzioni oltre al colore** (scelta di Rocco): nessuna gestione delle finestre private,
  nessun contenuto nella pagina.

## 📦 La cartella dell'estensione e lo ZIP

Tutto quello che il browser carica vive in `extension/`; il resto del repo (regole, README,
script) non entra nel pacchetto.

- **Caricare decompressa**: si sceglie la cartella `extension/`.
- **Lo ZIP per lo store**: `python3 scripts/package.py [cartella]` scrive
  `monochromenewtab-<versione>.zip`; gli ZIP non si committano (`.gitignore`).
- **Le icone** le disegna `scripts/icons.py` (Pillow) coi due colori predefiniti; si rifanno se
  cambiano i colori.
- **Niente tag, release né pubblicazione sullo store** senza il via di Rocco.

## 🔢 Versione

**SlimVer `x.xx`**, con la fonte unica in `version_name` del manifest, che le opzioni mostrano in
fondo alla pagina.

- **Il campo `version`** è quello che il browser confronta per gli aggiornamenti, e non accetta
  zeri iniziali (`1.05` non è valido): `scripts/package.py` lo ricava come `x.<intero di xx>`
  (`0.10` dà `0.10`, `1.05` dà `1.5`), un ordine uguale a quello di SlimVer. Fa da numero di build.
- **Prima di un commit sul prodotto** si alza `version_name` e si lancia `scripts/package.py`, o
  almeno `scripts/package.py --check`.

## 🔒 Permessi e privacy

Solo il permesso **`storage`**, che non mostra avvisi all'installazione. Nessun accesso ai siti,
nessuna rete, nessun dato raccolto: i colori restano in `chrome.storage.local` sul computer.

- È una promessa scritta nel README, nelle opzioni, in `PRIVACY.md` (l'indirizzo che la scheda
  dello store dà come informativa) e nelle risposte sulla privacy dello store: un permesso nuovo
  cambia la promessa, e si chiede prima a Rocco.

## 🎨 Il colore senza lampo

La scheda nuova deve avere il colore giusto dal primo fotogramma.

- **I colori predefiniti** vivono solo in `Colors.defaults` dentro `extension/colors.js`; le
  opzioni li leggono da lì per 'Reset to defaults', e `scripts/icons.py` li legge per le icone.
- **I colori di Rocco**: `chrome.storage.local` è la fonte, ma è asincrona; per questo `colors.js`
  ne tiene una copia in `localStorage`, che legge in modo sincrono appena caricato, prima del primo
  disegno, e scrive sempre `--light` e `--dark` sulla radice (la copia o i predefiniti). Poi la
  pagina si corregge dalla fonte e segue i cambi delle opzioni.
- **Un solo script, primo nella `<head>`, classico e non modulo**: un modulo è differito e
  arriverebbe dopo il primo disegno. Manifest V3 vieta gli script dentro la pagina, quindi è un file
  a parte; lo stile dentro la pagina è invece consentito, e la scheda lo tiene lì: nessun foglio di
  stile da chiedere prima del primo fotogramma.
- **Niente transizioni, niente `theme-color`**, `color-scheme` dichiarato, titolo fisso 'New Tab'.
- **L'icona della scheda** è `extension/icons/blank-tab.svg`: un quadrato arrotondato fatto di
  otto trattini della stessa lunghezza, quattro sugli angoli (archi) e quattro al centro dei lati,
  su una griglia 16x16 con tratto 2,5 e bordo esterno allineato ai pixel, colore `#808080`
  (dalla 1.02, chiesto da Rocco: tratto più spesso, trattini tutti uguali). Vivaldi la mostra
  (collaudo di Rocco sulla 1.01). Le icone dell'estensione (16, 32, 48 e 128) restano quelle di
  `scripts/icons.py` e non si usano come favicon.
- **Il lampo che resta**: prima che la pagina arrivi, il browser riempie la scheda col suo sfondo.
  Quello non dipende dall'estensione; in Vivaldi si può solo osservarlo (dalla 1.00).

## 🧪 Come si prova

- **Il banco Playwright** (fuori dal repo, da rifare se serve) carica `extension/` in Chromium con
  `--load-extension` e controlla: apertura delle opzioni all'installazione, titolo, colori
  predefiniti in chiaro e in scuro, colore giusto prima che risponda la fonte, salvataggio in `chrome.storage.local`, colore di una scheda
  aperta che segue le opzioni, copia sincrona per il primo disegno, ripristino.
- **Il collaudo di Rocco in Vivaldi** resta necessario: il passo 'Controlled by Extension', il
  fuoco nella barra degli indirizzi, il colore misurato contro la barra del suo tema, il passaggio
  chiaro e scuro del sistema, il lampo all'avvio.
