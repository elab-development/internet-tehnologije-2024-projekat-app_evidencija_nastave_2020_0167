# Raspored Nastave - Schedule Management App

Veb aplikacija za evidenciju rasporeda nastave

# Opis projekta

Aplikacija omogućava administraciji i studentima efikasno upravljanje rasporedom nastave. Studenti mogu da prate svoj raspored, evidentiraju prisustvo, i preuzmu kalendar u formatu kompatibilnom sa Google Calendar-om. Administratori imaju uvid u sve korisnike, predmete, i statistiku prisustva.

## Tehnologije

### Backend
- **Laravel 11** - PHP framework
- **MySQL** - Relaciona baza podataka
- **Sanctum** - API autentifikacija

### Frontend
- **React 18** - JavaScript biblioteka
- **React Router** - Routing
- **Tailwind CSS** - Stilizovanje
- **Axios** - HTTP klijent
- **Chart.js** - Vizualizacija podataka
- **Lucide React** - Ikone

## Instalacija i pokretanje

### Preduslovi
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL

### Backend (Laravel)
```bash
# Pozicioniraj se u Laravel folder
cd raspored-laravel

# Instaliraj dependencies
composer install

# Kopiraj .env fajl
cp .env.example .env

# Generiši app key
php artisan key:generate

# Konfiguriši bazu u .env fajlu
# DB_DATABASE=raspored_nastave
# DB_USERNAME=root
# DB_PASSWORD=

# Pokreni migracije i seeders
php artisan migrate --seed

# Kreiran symbolic link za storage
php artisan storage:link

# Pokreni server
php artisan serve
```
Backend će biti dostupan na: http://127.0.0.1:8000

### Frontend (React)
```bash
# Pozicioniraj se u React folder
cd raspored-react

# Instaliraj dependencies
npm install

# Pokreni development server
npm start
```
Frontend će biti dostupan na: http://localhost:3000

Korisničke uloge
Aplikacija ima tri uloge:
1. Administrator

Upravljanje korisnicima (dodavanje, brisanje, pregled)
Upravljanje predmetima (dodavanje, brisanje, pregled)
Upravljanje rasporedom nastave
Pregled statistike prisustva

Test nalog:

Email: admin@admin.com
Password: admin

2. Student

Pregled svog rasporeda nastave
Evidencija prisustva na časovima
Preuzimanje rasporeda u ICS formatu (Google Calendar)
Upravljanje profilom (izmena podataka, upload slike)

Test nalog:

Email: ana@student.com
Password: ana123

3. Guest

Ograničen pristup aplikaciji
Pregled osnovnih informacija


Funkcionalnosti
Za studente:

Pregled ličnog rasporeda nastave
Evidencija prisustva na nastavi
Export rasporeda u ICS formatu (Google Calendar integracija)
Upravljanje profilom i upload profilne slike
Izmena lozinke

Za administratore:

CRUD operacije nad korisnicima (filtriranje, pretraga, paginacija)
CRUD operacije nad predmetima (filtriranje po semestru)
Vizualizacija statistike prisustva (Chart.js grafikoni)
Upravljanje rasporedom nastave

Dodatne funkcionalnosti:

Pretraga i filtriranje po više kriterijuma
Paginacija listi
Breadcrumbs navigacija
Responzivan dizajn (Tailwind CSS)
Autentifikacija i autorizacija (Sanctum tokens)
Upload i brisanje profilnih slika


Struktura projekta
internet-tehnologije-2024-projekat/
│
├── raspored-laravel/          # Backend Laravel aplikacija
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Middleware/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
│
└── raspored-react/            # Frontend React aplikacija
    ├── src/
    │   ├── components/        # Reusable komponente
    │   ├── pages/            # Stranice
    │   ├── contexts/         # Context API (Auth)
    │   ├── services/         # API servisi
    │   └── hooks/            # Custom hooks
    └── public/


API Endpoints
Autentifikacija

POST /api/login - Login
POST /api/register - Registracija
POST /api/logout - Logout

Student

GET /api/student/profile - Profil studenta
PUT /api/student/profile - Ažuriranje profila
POST /api/student/profile/image - Upload slike
DELETE /api/student/profile/image - Brisanje slike
GET /api/student/schedule - Raspored studenta
GET /api/student/calendar-export - Export ICS kalendara

Admin

GET /api/admin/users - Lista korisnika
POST /api/admin/users - Dodavanje korisnika
DELETE /api/admin/users/{id} - Brisanje korisnika
GET /api/admin/subjects - Lista predmeta
POST /api/admin/subjects - Dodavanje predmeta
DELETE /api/admin/subjects/{id} - Brisanje predmeta
GET /api/admin/attendance/stats - Statistika prisustva



Autor:
Sofija Damnjanović
Broj indeksa: 2020/0167
Fakultet organizacionih nauka
Univerzitet u Beogradu    

GitHub Repository
https://github.com/elab-development/internet-tehnologije-2024-projekat-app_evidencija_nastave_2020_0167
