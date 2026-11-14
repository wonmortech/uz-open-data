# uz-open-data

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/wonmortech/uz-open-data/badge)](https://scorecard.dev/viewer/?uri=github.com/wonmortech/uz-open-data)

Small, open datasets about Uzbekistan, with the exact query or source each one was built from.

| Folder | What | Licence |
|---|---|---|
| [`mosques/`](mosques/) | 2,289 mosques from OpenStreetMap as GeoJSON points (snapshot 2026-11-13), the Overpass query and a converter | Data: **ODbL 1.0**, © OpenStreetMap contributors. Query and script: MIT |
| [`alphabet/`](alphabet/) | Uzbek Cyrillic → 2026 Latin letter table (CSV), transcribed from [bitg](https://github.com/dtwinuz/bitg) | MIT (derived from bitg, MIT OR Apache-2.0) |

Planned: Uzbek word lists. Nothing is published for them yet.

## Principles

- **Reproducible.** Every dataset comes with the query, script or source file it was made from, and the date it was made.
- **Unchanged values.** Tag values and letters are copied as they are in the source; corrections belong upstream (in OpenStreetMap, or in bitg).
- **Licence per folder.** Each folder states its own licence. Data from OpenStreetMap stays under the ODbL and needs the attribution "© OpenStreetMap contributors".

## Licence

Unless a folder says otherwise, code and documentation in this repository are under the [MIT licence](LICENSE). The data in `mosques/mosques.geojson` is under the ODbL 1.0 (see [`mosques/LICENSE-ODbL.md`](mosques/LICENSE-ODbL.md)).
