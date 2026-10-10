# AP Archive · Galaxy prototype

Standalone first visual direction for the archive explorer. The prototype reads the repository's public Archive 2 catalog at `../../data/archive2-catalog.json` and uses the existing `Archive2Core.decodeCatalog` helper. Exam preview opens the existing `engine.html` source route; it does not generate questions, save papers, or assign work to students.

Start a local server from the repository root:

```sh
python3 -m http.server 4173
```

Open `http://localhost:4173/archive/prototypes/ap-galaxy/`.

The generated art in `assets/` is used as image assets. `design-reference.png` is an internal visual target, not a page background. The unit map draws a live line from the selected exam to other filtered schools that share the same actual catalog `L2` / `standardUnit` tag. The current catalog has no `L3` values, so the UI states that these are broader unit-tag links. Tag presence does not mean review completion, and changing grade, school, year, search, or unit filters recomputes the links.
