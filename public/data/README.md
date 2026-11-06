# METHO Lite address data

This folder contains a compact, local Bangladesh administrative lookup dataset used by the address suggestion system.

- `bd-admin.json`: 64 districts and 494 upazilas, grouped for fast lookup. This file is approximately 26 KB before compression.
- Source: [ifahimreza/bangladesh-geojson](https://github.com/ifahimreza/bangladesh-geojson), `src/data/bd-districts.json` and `src/data/bd-upazilas.json`.
- The source dataset is offered under the Open Database License (ODbL). See [LICENSE-ODbL.txt](./LICENSE-ODbL.txt) and https://opendatacommons.org/licenses/odbl/1-0/.
- The source project reports 8 divisions, 64 districts, and 494 upazilas. Names may contain source spelling variations; METHO keeps its own canonical district labels for matching courier zones.

The full boundary GeoJSON, road network, and bazaar data are intentionally not loaded by the storefront. Additional place data must be split into small, lazy-loaded files and reviewed for licensing and performance before use.
