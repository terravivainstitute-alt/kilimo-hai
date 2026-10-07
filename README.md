# Kilimo Hai — Tovuti ya Huduma za Kilimo Hai

Tovuti ya lugha mbili (Kiswahili/English) inayotoa ushauri wa Agronomist, mauzo ya
organic fertilizer na madawa ya asili ya wadudu, na booking yenye malipo.

**Tech stack:** Next.js 15 + TypeScript + Tailwind CSS v4 + Supabase (database, auth)

Supabase project tayari imeshaundwa na kujazwa data za awali:
- Project: `kilimo-hai` (region: `eu-west-1`)
- Majedwali: `services`, `bookings`, `products`, `orders`, `blog_posts`, `site_content`
- `.env.local.example` tayari ina URL na anon key sahihi za project hii.

## 1. Anzisha kwenye kompyuta yako

```bash
# Toa faili zote kwenye folder
cd kilimo-hai-website

# Sakinisha dependencies
npm install

# Nakili env file
cp .env.local.example .env.local

npm run dev
```

Fungua http://localhost:3000

## 2. Tengeneza akaunti ya admin (Supabase Auth)

1. Nenda https://supabase.com/dashboard/project/idxkstcogilutwvaocvx
2. **Authentication → Users → Add user** — jaza email na password utakayotumia kuingia `/admin/login`
3. Ingia kwenye http://localhost:3000/admin/login na taarifa hizo

## 3. Pandisha kwenye GitHub

```bash
cd kilimo-hai-website
git init
git add .
git commit -m "Kilimo Hai — msingi wa tovuti (Next.js + Supabase)"

# Unda repo mpya tupu kwenye github.com, kisha:
git branch -M main
git remote add origin https://github.com/<jina-lako>/kilimo-hai-website.git
git push -u origin main
```

Ukishamaliza, niambie jina la repo (mfano `jina-lako/kilimo-hai-website`) — nitaweza
kukuunganishia na Vercel moja kwa moja kupitia project uliyonipa ufikiaji wake, na
kukuwekea environment variables za Supabase huko pia.

## 4. Deploy kwenye Vercel (baada ya GitHub)

Ukiwa tayari umeunganisha Vercel na GitHub repo:

1. Vercel → Add New Project → chagua repo hii
2. Weka Environment Variables (zilezile za `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

## Bado haijakamilika (hatua zinazofuata)

- **Malipo (M-Pesa/Tigo Pesa/Airtel Money)**: fomu ya booking na duka bado hazijaunganishwa
  na Selcom/ClickPesa — hii inahitaji akaunti ya mtoa huduma wa malipo kwanza.
- **Kikapu cha duka (cart/checkout)**: kitufe cha "Weka kwenye kikapu" bado ni cha mwonekano
  tu — hakijaunganishwa na jedwali la `orders` bado.
- **Upload wa picha za bidhaa/blogu**: kwa sasa unaweka URL ya picha moja kwa moja; Supabase
  Storage inaweza kuongezwa baadaye kwa upload wa moja kwa moja kutoka admin dashboard.
- **SMS/Email arifa** za booking mpya kwa admin.

Kila moja ya hizi inafuata muundo uleule ulio tayari kwenye mradi — niambie ni ipi ya kuanza
nayo.
