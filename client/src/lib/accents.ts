/**
 * Categorical accent classes, built on the --cat-* tokens in index.css.
 *
 * Why full class strings instead of `bg-cat-${n}/10`: Tailwind scans source
 * text, so an interpolated class name produces no CSS at all. Every variant a
 * component can use has to appear literally somewhere in the source, and this
 * file is that somewhere. That includes the hover variants — `group-hover:` +
 * a runtime string is the same trap, hence `inkHover` below.
 *
 * The rule the tokens encode:
 *   - `ink`      for text. Every --cat-* value is measured to clear 4.5:1
 *                against the card in both themes, so small labels are safe.
 *   - `inkHover` the same colour, applied when the enclosing `.group` is hovered.
 *   - `chip`     for an icon tile: a 10% wash of the hue plus the hue as the
 *                icon colour.
 *   - `edge`     a solid fill, for a rule along a card edge. Graphic, not text.
 *   - `ring`     a hover border, so the card answers the pointer in its own hue.
 *
 * Colour here is categorical — it tells one thing apart from another. It is
 * never decoration sprayed over a surface, and it never carries meaning on its
 * own (WCAG 1.4.1): every accented item also has its own label.
 *
 * Actions stay teal site-wide (`bg-secondary` / `text-secondary-ink`) so a
 * coloured card never turns its own button a different colour.
 */

export type Accent = {
  chip: string;
  ink: string;
  inkHover: string;
  edge: string;
  ring: string;
};

export const ACCENTS: Accent[] = [
  { chip: "bg-cat-1/10 text-cat-1", ink: "text-cat-1", inkHover: "group-hover:text-cat-1", edge: "bg-cat-1", ring: "hover:border-cat-1/40" },
  { chip: "bg-cat-2/10 text-cat-2", ink: "text-cat-2", inkHover: "group-hover:text-cat-2", edge: "bg-cat-2", ring: "hover:border-cat-2/40" },
  { chip: "bg-cat-3/10 text-cat-3", ink: "text-cat-3", inkHover: "group-hover:text-cat-3", edge: "bg-cat-3", ring: "hover:border-cat-3/40" },
  { chip: "bg-cat-4/10 text-cat-4", ink: "text-cat-4", inkHover: "group-hover:text-cat-4", edge: "bg-cat-4", ring: "hover:border-cat-4/40" },
  { chip: "bg-cat-5/10 text-cat-5", ink: "text-cat-5", inkHover: "group-hover:text-cat-5", edge: "bg-cat-5", ring: "hover:border-cat-5/40" },
  { chip: "bg-cat-6/10 text-cat-6", ink: "text-cat-6", inkHover: "group-hover:text-cat-6", edge: "bg-cat-6", ring: "hover:border-cat-6/40" },
];

/** Accent by list position. For lists whose items have no category of their own. */
export function accentByIndex(index: number): Accent {
  return ACCENTS[index % ACCENTS.length];
}

/**
 * Stable accent for a named category, so "Pembangunan" keeps the same hue
 * wherever it appears instead of changing with its position in a list.
 * Two category names can land on the same hue; that is acceptable, because the
 * name is always printed next to the colour.
 */
export function accentForName(name: string | null | undefined): Accent {
  if (!name) return ACCENTS[0];
  let sum = 0;
  for (let i = 0; i < name.length; i += 1) sum += name.charCodeAt(i);
  return ACCENTS[sum % ACCENTS.length];
}
