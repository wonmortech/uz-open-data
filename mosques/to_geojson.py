"""Convert an Overpass JSON response (out tags center) into a GeoJSON FeatureCollection of points.

Usage: python to_geojson.py overpass.json mosques.geojson
"""
import json
import sys

KEEP = ("name", "name:uz", "name:ru", "addr:city")


def main(src, dst):
    data = json.load(open(src, encoding="utf-8"))
    features = []
    for el in data.get("elements", []):
        if el["type"] == "node":
            lon, lat = el.get("lon"), el.get("lat")
        else:
            c = el.get("center") or {}
            lon, lat = c.get("lon"), c.get("lat")
        if lon is None or lat is None:
            continue
        tags = el.get("tags", {})
        props = {"osm_type": el["type"], "osm_id": el["id"]}
        props.update({k: tags[k] for k in KEEP if k in tags})
        features.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [lon, lat]},
            "properties": props,
        })
    features.sort(key=lambda f: (f["properties"]["osm_type"], f["properties"]["osm_id"]))
    with open(dst, "w", encoding="utf-8", newline="\n") as f:
        f.write('{"type":"FeatureCollection","features":[\n')
        f.write(",\n".join(json.dumps(x, ensure_ascii=False, separators=(",", ":")) for x in features))
        f.write("\n]}\n")
    by_type = {}
    for x in features:
        by_type[x["properties"]["osm_type"]] = by_type.get(x["properties"]["osm_type"], 0) + 1
    print(json.dumps({"features": len(features), "elements": len(data.get("elements", [])), "by_type": by_type,
                      "osm_base": data.get("osm3s", {}).get("timestamp_osm_base"),
                      "area_base": data.get("osm3s", {}).get("timestamp_areas_base")}))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
