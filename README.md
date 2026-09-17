# JPureva — Farm to Kitchen, Verified

A B2B food-traceability marketplace connecting Suppliers/FPOs, NABL-accredited Labs, and
Hotels/Restaurants. Every ingredient batch is lab-certified and traceable via a public QR
scan (no login required); hotels get their own restaurant-level Trust Badge.

## Stack

- **Backend**: Django 5 + Django REST Framework, JWT auth (`djangorestframework-simplejwt`),
  PostgreSQL (SQLite fallback), QR generation (`qrcode`), EXIF geo-tag parsing (`piexif`).   
- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4. 

## Running locally

### Backend (`backend/`)   

```bash
cd backend
./venv/Scripts/python.exe manage.py migrate
./venv/Scripts/python.exe manage.py seed_demo   # categories, test types, subscription plans, demo users
./venv/Scripts/python.exe manage.py runserver 8000
```

Database defaults to SQLite (`DJANGO_DB_BACKEND=sqlite` in `backend/.env`) because the local
PostgreSQL 18 service (`postgresql-x64-18`) wasn't running and starting it needed elevation
this environment didn't have. To switch to Postgres:
1. Start the service (as admin): `net start postgresql-x64-18`
2. Create the db/user: `createuser -U postgres -P jpureva_user` then `createdb -U postgres -O jpureva_user jpureva_db`
3. Set `DJANGO_DB_BACKEND=postgres` in `backend/.env` and re-run `migrate`.

### Frontend (`frontend/`)

```bash
cd frontend
npm run dev   # http://localhost:3000, expects the API at http://localhost:8000/api (see .env.local)
```

## Demo accounts (from `seed_demo`)

| Role | Email | Password |
|---|---|---|
| Admin | admin@jpureva.com | adminpass123 |
| Hotel | demo.hotel@jpureva.com | demopass123 |
| Supplier | demo.supplier@jpureva.com | demopass123 |
| Lab | demo.lab@jpureva.com | demopass123 |

## What's implemented

Full golden path, verified end-to-end (backend via `curl`, frontend via a scripted
Playwright pass — see screenshots if you re-run `pw-check`): registration + admin approval
for suppliers/labs, supplier batch creation with EXIF-locked geo-tagged photos and
pre-harvest growth-anomaly detection, lab certification with QR generation, hotel
browse/cart/checkout/order-tracking, the anonymous `/scan/{batchId}` provenance page,
notifications, compliance documents, subscriptions, and the admin panel.

Deliberate MVP simplifications (see plan for rationale): certificate "digital signature" is
a SHA-256 integrity hash + signed stamp (not full PKI); cold-chain/IoT data is
manually/API-logged, not ingested from real sensors; payouts are an internal ledger with no 
live payment gateway; notifications are in-app only, no email/SMS delivery.
