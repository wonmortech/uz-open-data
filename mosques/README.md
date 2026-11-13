# Mosques in Uzbekistan (OpenStreetMap snapshot)

`mosques.geojson` is a snapshot of every object in OpenStreetMap inside Uzbekistan's national boundary that is tagged `amenity=place_of_worship` and `religion=muslim`. It is the same filter described in the post [Mosques from OpenStreetMap](https://wonmor.io/engineering/mosques-from-openstreetmap/).

## Snapshot

| | |
|---|---|
| Features | **2,289** (1,511 nodes, 740 ways, 38 relations) |
| Query sent | 2026-11-13 07:33:00 UTC |
| Response received | 2026-11-13 07:33:41 UTC |
| OSM data as of (`timestamp_osm_base`) | 2026-11-13T07:32:21Z |
| Area data as of (`timestamp_areas_base`) | 2026-11-13T04:27:32Z |
| Endpoint | `https://overpass-api.de/api/interpreter` |

The post reports 2,285 congregations from its own import on an earlier date. The difference is expected: OpenStreetMap is edited continuously, and this file is a new pull, not a copy of that import.

## Format

A GeoJSON `FeatureCollection`. Each feature is a `Point` in WGS 84 (`[longitude, latitude]`):

- for a node, the node's own coordinates;
- for a way or relation, the `center` that Overpass computes.

Properties, and nothing else:

| Property | Always present | Meaning |
|---|---|---|
| `osm_type` | yes | `node`, `way` or `relation` |
| `osm_id` | yes | OpenStreetMap ID; `https://www.openstreetmap.org/<osm_type>/<osm_id>` opens the object |
| `name` | no | `name` tag |
| `name:uz` | no | `name:uz` tag |
| `name:ru` | no | `name:ru` tag |
| `addr:city` | no | `addr:city` tag |

Tag values are copied as mappers entered them; they are not corrected or transliterated. Features are sorted by `osm_type`, then `osm_id`, so a re-run produces a readable diff.

## Rebuild

```bash
curl -s https://overpass-api.de/api/interpreter --data-urlencode data@query.overpassql -o overpass.json
python3 to_geojson.py overpass.json mosques.geojson
```

[`query.overpassql`](query.overpassql) is the query from the post, unchanged. [`to_geojson.py`](to_geojson.py) uses only the Python standard library. The public Overpass servers are shared and sometimes answer 502 or 504 under load; wait and retry rather than hammering them.

## Licence and attribution

Data: **© OpenStreetMap contributors, available under the [Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/1-0/)**. See [`LICENSE-ODbL.md`](LICENSE-ODbL.md). If you use or redistribute `mosques.geojson`, keep this attribution, and share any adapted database under the ODbL. See <https://www.openstreetmap.org/copyright>.

`query.overpassql` and `to_geojson.py` are MIT (see the repository root).
