Featured card (`featured: true`, i.e. cd/ui) now has a 4px `border-brand` border and `mt-3` between title and description (was `mt-1`). Other cards are unchanged.

Edited only `src/components/project-card.tsx`, using the existing `featured` flag and the existing `brand` token -> skipped: new CSS/variant prop/helper, add when a second variant appears. Not run: no typecheck/build (no installs allowed).
