# Ward 13 Local Asset Sources & Licenses

All five PBR texture sets below are downloaded as local 1K JPG maps. The HTML loads these relative local files from `assets/images/ward13/pbr/`; gameplay does not request image files from a remote URL.

| Asset | Use in scene | Included maps | License/source |
|---|---|---|---|
| Concrete Wall 006 (`concrete_wall_006`) | Damaged hospital walls | Diffuse, OpenGL normal, roughness, AO | CC0, Poly Haven: https://polyhaven.com/a/concrete_wall_006 |
| Concrete Floor Damaged 01 (`concrete_floor_damaged_01`) | Ceilings, utility-room concrete | Diffuse, OpenGL normal, roughness, AO | CC0, Poly Haven: https://polyhaven.com/a/concrete_floor_damaged_01 |
| Dirty Tiles (`dirty_tiles`) | Hospital floors and corridors | Diffuse, OpenGL normal, roughness, AO | CC0, Poly Haven: https://polyhaven.com/a/dirty_tiles |
| Rusty Metal 02 (`rusty_metal_02`) | Doors, trim, equipment | Diffuse, OpenGL normal, roughness, AO | CC0, Poly Haven: https://polyhaven.com/a/rusty_metal_02 |
| Old Wood Floor (`old_wood_floor`) | Shelving and wood furniture | Diffuse, OpenGL normal, roughness, AO | CC0, Poly Haven: https://polyhaven.com/a/old_wood_floor |

Poly Haven publishes these asset pages with CC0 license information. Files were retrieved from the Poly Haven public files API (`https://api.polyhaven.com/files/{asset-id}`); exact file URLs, MD5s, and byte counts are recorded in `assets/ward13/pbr/asset-manifest.json`.

## Runtime/library

- Three.js r128 is locally bundled at `assets/js/three-r128-min.js` from cdnjs' Three.js r128 distribution. The Three.js project license is MIT; see `assets/licenses/three-license.txt`.
- The HTML also retains the original project's existing audio synthesis and Three.js scene/game systems.
