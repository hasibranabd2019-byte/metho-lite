# METHO Lite address data

This folder contains a compact, local Bangladesh administrative lookup dataset used by the address suggestion system.

- `bd-admin.json`: 64 districts and 494 upazilas, grouped for fast lookup. This file is approximately 26 KB before compression.
- Source: [ifahimreza/bangladesh-geojson](https://github.com/ifahimreza/bangladesh-geojson), `src/data/bd-districts.json` and `src/data/bd-upazilas.json`.
- The source dataset is offered under the Open Database License (ODbL). See [LICENSE-ODbL.txt](./LICENSE-ODbL.txt) and https://opendatacommons.org/licenses/odbl/1-0/.
- The source project reports 8 divisions, 64 districts, and 494 upazilas. Names may contain source spelling variations; METHO keeps its own canonical district labels for matching courier zones.

The full boundary GeoJSON, road network, and bazaar data are intentionally not loaded by the storefront. Additional place data must be split into small, lazy-loaded files and reviewed for licensing and performance before use.


## Dhaka address and delivery-zone matching

METHO Lite classifies destinations into three existing courier-price zones: Jhenaidah district, Dhaka city (inside DNCC/DSCC urban localities), and outside Dhaka city. The current price schedule is retained; the storefront and server now share the same tier calculation. Dhaka-city localities are mapped to a city police-station label, while named metropolitan suburbs (Savar/Ashulia, Keraniganj/Jinjira, Tongi, Fatullah/Siddhirganj) remain in the outside-Dhaka tier. Purbachal is not force-mapped to a single district because it spans more than one district; a clear upazila/district is still needed.

Reference material used to review names and grouping:
- [Bangladesh National Portal — Upazila list](https://bangladesh.gov.bd/views/upazila-list) for administrative context. The local compact file above remains the existing 64-district/494-upazila source pending a fully verified refresh.
- [Dhaka metropolitan suburbs list (Bangla Wikipedia)](https://bn.wikipedia.org/wiki/ঢাকা_মেট্রোপলিটন_এলাকার_শহরতলির_তালিকা), used as a reference for city vs suburb grouping; article content is available under Wikipedia's CC BY-SA terms.
- [raadu/dhaka-city-corporation-data](https://github.com/raadu/dhaka-city-corporation-data), consulted as a cross-check only. No data was bulk-copied because the repository does not declare a clear license in its root documentation.
