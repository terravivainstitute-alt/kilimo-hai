# Kilimo Hai — Tovuti ya Huduma za Kilimo Hai

Tovuti ya lugha mbili (Kiswahili / English) ya huduma za kilimo hai: ushauri wa Agronomist,
mbolea za asili (compost), madawa ya asili ya wadudu, matukio na picha/video, na booking ya wakulima.
Maudhui yote yanabadilishwa na admin bila kuandika msimbo.

**Tech stack:** Next.js 15 + TypeScript + Tailwind CSS v4 + Supabase (database, auth, storage) + Vercel

## Vipengele

**Kwa wageni**
- Kurasa: Nyumbani, Huduma, Duka, Matukio, Kuhusu, Blogu, Wasiliana, Booking
- Kitufe cha kubadilisha lugha SW / EN
- Picha na video zinafunguka palepale kwenye ukurasa (dirisha kubwa lenye mishale)
- Video za YouTube / Vimeo au zilizopakiwa moja kwa moja
- Fomu ya booking ya ushauri

**Kwa admin** (`/admin/login`)
- Muhtasari, Bookings (badilisha hali, futa)
- Huduma na vifurushi vyake (ongeza, hariri, ficha, futa)
- Bidhaa (picha na video)
- Matukio na Picha (picha nyingi na video, maelezo kwa lugha mbili)
- Blogu (picha ya juu, video, chapisha/rasimu)
- Maudhui na Mawasiliano (hero, kuhusu, simu, WhatsApp, email, mahali)
- Maneno ya Tovuti: kila neno la menyu, vitufe na vichwa linaweza kubadilishwa au kufutwa
- Kuingia kwa email na password (jicho la kuonyesha password) na "Umesahau password?"

## Muundo wa mradi

```
app/                 kurasa za tovuti na admin
  admin/             login, forgot-password, reset-password, dashboard/*
  components/        Navbar, Footer, MediaLightbox, admin/*
lib/                 supabase, LanguageContext, i18n (sw/en), media, storage, useContact, slug
types/content.ts     aina za data (Service, Product, EventItem, BlogPost, ...)
public/              logo
```

## 1. Kuanzisha kwenye kompyuta

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Fungua http://localhost:3000

## 2. Environment variables

| Jina | Maelezo |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL ya Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Funguo ya umma (publishable) ya Supabase |

Funguo hizi ni za umma kwa muundo. Usalama wa data unalindwa na sheria za RLS kwenye Supabase.
Usiweke kamwe `service_role` key kwenye msimbo wa tovuti.

## 3. Supabase

Project: `kilimo-hai` (region `eu-west-1`)

- **Majedwali:** `services`, `bookings`, `products`, `orders`, `blog_posts`, `events`, `site_content`, `admins`
- **Storage:** bucket ya umma `media` (picha hadi 5MB, video hadi 50MB: MP4, WEBM, MOV)
- **Ruhusa:** wageni wanasoma maudhui yaliyochapishwa na kutuma booking. Kuhariri ni kwa
  emails zilizo kwenye jedwali la `admins` pekee (kupitia function `is_admin()`).

### Kuongeza admin mwingine

1. Supabase → Authentication → Users → Add user (weka **Auto Confirm User**)
2. Supabase → SQL Editor:

```sql
insert into public.admins (email) values ('barua@mfano.com');
```

### Mipangilio muhimu (Authentication)

- **URL Configuration:** Site URL = anwani ya tovuti yako. Redirect URLs ongeza `https://ANWANI-YAKO/**`
  (inahitajika ili "forgot password" ifanye kazi).
- **Sign In / Providers:** zima "Allow new users to sign up" (usajili wa umma).

## 4. Deploy (GitHub + Vercel)

1. Pandisha msimbo kwenye GitHub (repo `kilimo-hai`)
2. Vercel → Add New Project → chagua repo
3. Environment Variables: weka mbili zilizo hapo juu
4. Deploy. Kila `commit` mpya kwenye `main` inajijenga yenyewe.

## 5. Vikomo vya kujua

- Video kubwa kuliko 50MB: ziweke YouTube kisha ubandike kiungo kwenye admin.
- Tumia video za **MP4** kwa uhakika wa kucheza kwenye vifaa vyote.
- Mpango wa bure wa Supabase una ukomo wa bandwidth. YouTube haihesabiwi.
- Barua pepe za Supabase (reset password) ni chache kwa saa kwenye mpango wa bure.

## Bado haijakamilika

- **Malipo ya mobile money** (M-Pesa, Tigo Pesa, Airtel Money kupitia Selcom au ClickPesa)
- **Kikapu cha duka na checkout:** kitufe cha "Weka kwenye kikapu" ni cha mwonekano tu bado
- **Arifa za SMS/Email** kwa admin booking mpya ikiingia
- Video kwenye huduma na ukurasa wa Kuhusu
