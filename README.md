# Eating Risk App (Angular + Node.js)

Bu proje deploy edilmeye hazir hale getirildi.

## Mimari
- `client/`: Angular 16 arayuz
- `server/`: Node.js + Express API
- Tek host: Production'da backend, Angular `dist` dosyalarini da servis eder.
- API yolu: `/api/*`
- XAI uyumlu ek faktorler: `Cognitive Control`, `Affective`, `Salience/Taste`, `Body Image`, `Habit`

## Local Calistirma

### Backend
```bash
cd server
npm install
npm run dev
```
Backend: `http://localhost:5000`

### Frontend
```bash
cd client
npm install
npm start
```
Frontend: `http://localhost:4200`

## Render Uzerine Deploy (Uzak sunucu gerekmez)

1. Projeyi GitHub'a push et.
2. `https://render.com` uzerinden hesap ac.
3. `New +` -> `Blueprint` sec.
4. GitHub repo'yu bagla.
5. Render otomatik `render.yaml` dosyasini okuyup service'i olusturacak.
6. Deploy bitince tek bir URL alacaksin ve hem frontend hem backend o URL'de calisacak.

Not: Bu MVP surumunde veri bellekte tutuluyor. Render yeniden baslatirsa kayitlar silinir.

## Entegre Edilen Kaynak
- Kaggle Notebook: `Analyzing Eating Disorder Survey Data with XAI`
- Notebookun kullandigi anket iskeleti (Neurobehavioral Factors) uygulamadaki ek 5 soru grubuna uyarlandi.

## Tek Komutla Build/Start Scriptleri
Kok dizinde:
- `npm run build`
- `npm run start`

Render bunlari otomatik kullanacak sekilde ayarlandi.
