Edited `src/components/project-card.tsx`: when `project.featured` is set, the card gets `border-4 border-brand` (yellow, 4px) and the description margin goes from `mt-1` to `mt-3`. Other cards are unchanged.

Skipped: no new prop, CSS or helper, since `featured` was already on the data. Add a class-merging helper if more variants show up.
