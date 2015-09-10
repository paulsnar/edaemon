# Edaemon

This README is also [available in English](README.md).

Edaemon ir samērā vienkārša stundu saraksta izmaiņu attēlošanas programmatūra.

## Uzstādīšana

Edaemon ir veidots, lai būtu savietojams ar Google App Engine. Ja nav gaidāmi
pārāk daudzi pieprasījumi, tas pilnvērtīgi iekļaujas bezmaksas kvotās.

Lai to uzstādītu:

1. Uz sava datora uzstādi [Google App Engine SDK priekš Python](https://cloud.google.com/appengine/downloads)
(un Python 2.7, ja tev tā nav).
2. Izveido jaunu lietotni [Google Developers Console](https://console.developers.google.com).
  Nosaukums nav no liela svara. HTTPS arī ir iekļauts (izsniedz Google).
3. Klonē šo repozitoriju uz sava datora (specifiski, kādu no tās birkotajiem
  komitiem).
4. No repozitorijas mapes izpildi `pip install -r requirements.txt -t lib/`,
  lai iegūtu Edaemon darbināšanai nepieciešamās bibliotēkas.
5. Kopē `app.yaml.example` uz `app.yaml` un aizpildi sekojošos parametrus:
  - `env_variables.EDAEMON_APP_SECRET_KEY`: Šo vajadzētu aizvietot ar apmēram 32
  nejaušiem simboliem.
  - `env_variables.EDAEMON_APP_SILENT`: Dažās vietās Edaemon žurnālā var ierakstīt
  kļūdas, piemēram, XSRF žetonu nesakritību pie administrācijas ielogošanās.
  Ja tas nav vēlams, iestati šo uz 1.
  - `env_variables.GA_TRACKING_ID`: Ja vēlies izmantot Google Analytics savā
  Edaemon instancē, šeit ieliec savu Google Tracking ID (formātā `UA-12345678-1`).
  Tas tiks injicēts katrā lapā (sk. [vendor/edaemon/templates/layout.j2](vendor/edaemon/templates/layout.j2))
6. Izpildi `appcfg.py -A tavas-lietotnes-id-12345 update ./` no klonētās
  repozitorijas atrašanās vietas. `appcfg.py` nodrošina Google App Engine SDK priekš Python.
  Ja tas nedarbojas, konsultējies ar
  [Google App Engine SDK priekš Python rokasgrāmatu](https://cloud.google.com/appengine/docs/python/).
7. Dodies uz savu jaunuzstādīto Edaemon instanci un izveido pirmo lietotāju!

Priekš Windows šīs (un citas) instrukcijas var atšķirties. Diemžēl pašlaik par
to es vairāk neko nezinu, bet, ja esi izmēģinājis un tev ir/nav izdevies,
vienmēr laipni lūdzu iesniegt vilkšanas pieprasījumu.

## Testēšana

Edaemon nāk ar testu komplektu, kas atrodams mapē `tests`. Ja pievieno jaunu
funkcionalitāti, lūdzu pārliecinies, ka esi arī pievienojis testus šajā mapē
un atzīmējis šos testus izpildīšanai `tests/__init__.py`. Citādā gadījumā tavs
kods var netikt pieņemts.

Lai izpildītu pašlaik pieejamos testus:

1. Pārliecinies, ka tev ir Python,
  [Google App Engine SDK priekš Python](https://cloud.google.com/appengine/downloads),
  un visas `requirements.txt` pieprasītās bibliotēkas ir atrodamas mapē `lib/`.
2. Pārliecinies, ka tavā PYTHONPATH ir iekļauts Google App Engine SDK,
  repozitorijas mape, mape `lib/` un mape `vendor/`.
  (Google App Engine SDK arī nav pats par sevi konsistents, tāpēc tavs PYTHONPATH
  var arī saturēt vairākas mapes, kas ir zem Google App Engine SDK atrašanās vietas.
  Ja mēģinot palaist testus dabū kļūdu, meklē to Google un visticamāk atradīsi
  atrisinājumu.)
3. Palaid `python -m unittest tests` (vai, ja `python` pēc noklusējuma nenorāda
  uz Python versiju 2.7, `python2` vai `python2.7`)

## Licence

Edaemon programmatūra tiek izplatīta zem Apache License 2.0 licences. Lai
uzzinātu vairāk, lūdzu skatīt [LICENSE.txt](LICENSE.txt) failu šajā repozitorijā.
