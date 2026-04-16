# Join – Kanban Project Management Tool

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Backend / Datenbank:** [Supabase](https://supabase.com) (PostgreSQL)
- **Auth:** Custom Login via Supabase `users`-Tabelle

---

## Datenbank

### Supabase URL
```
https://xyauklkutotqctcvrnyz.supabase.co
```

### Client
`js/supabase-client.js` – initialisiert `db` als globalen Supabase-Client.

---

## Tabellen

### users
| Spalte   | Typ           | Beschreibung         |
|----------|---------------|----------------------|
| id       | uuid (PK)     | Automatisch generiert |
| name     | text          |                      |
| email    | text (unique) |                      |
| password | text          |                      |

### contacts
| Spalte | Typ       | Beschreibung         |
|--------|-----------|----------------------|
| id     | uuid (PK) | Automatisch generiert |
| name   | text      |                      |
| email  | text      |                      |
| phone  | text      |                      |
| color  | text      | Hex-Farbe für Avatar |

### tasks
| Spalte      | Typ       | Beschreibung                                      |
|-------------|-----------|---------------------------------------------------|
| id          | uuid (PK) | Automatisch generiert                             |
| title       | text      |                                                   |
| description | text      |                                                   |
| category    | text      | `User Story`, `Technical Task`                    |
| priority    | text      | `Urgent`, `Medium`, `Low`                         |
| status      | text      | `To do`, `In progress`, `Await feedback`, `Done`  |
| duedate     | text      | Format: `YYYY-MM-DD`                              |
| assigned    | text      | JSON-Array mit Kontakt-IDs                        |
| subtasks    | jsonb     | Array von `{text, checked}` Objekten              |
| attachments | jsonb     | Array von Bild-Objekten (siehe unten)             |

#### attachments – Struktur eines Eintrags
```json
{
  "name": "screenshot.png",
  "type": "image/png",
  "size": 52400,
  "data": "data:image/png;base64,..."
}
```

---

## File Upload – Sicherheitsregeln

Der Bild-Upload in `js/file-upload.js` ist mehrschichtig abgesichert:

| Regel | Beschreibung |
|-------|-------------|
| **MIME Whitelist** | Nur `image/jpeg`, `image/png`, `image/webp` erlaubt |
| **Magic Bytes Check** | Die ersten 12 Bytes jeder Datei werden gegen die echte Datei-Signatur geprüft (verhindert Extension-Spoofing) |
| **1 MB Gesamtlimit** | Die Summe aller Anhänge pro Task darf 1 MB nicht überschreiten |
| **Canvas Re-Encoding** | Bilder werden über `<canvas>` neu gerendert → entfernt EXIF, Metadaten und eingebettete Payloads |
| **Max. 800×800 px** | Bilder werden beim Re-Encoding auf 800×800 px skaliert (Seitenverhältnis bleibt erhalten) |
| **Filename Sanitization** | Sonderzeichen und `../` werden entfernt, max. 100 Zeichen |
| **Base64-Speicherung** | Kein direkter Datei-Upload auf Server – Bilder landen als Base64 in der DB |

---

## Seiten

| Datei             | Beschreibung                  |
|-------------------|-------------------------------|
| `summary.html`    | Dashboard / Übersicht         |
| `board.html`      | Kanban-Board                  |
| `add_task.html`   | Task erstellen                |
| `contacts.html`   | Kontaktverwaltung             |
| `login.html`      | Login                         |
| `sign-up.html`    | Registrierung                 |
| `help.html`       | Hilfe                         |
| `legal-notice.html` | Impressum                   |
| `privacy-policy.html` | Datenschutz               |
