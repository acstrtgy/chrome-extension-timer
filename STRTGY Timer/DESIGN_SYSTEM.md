# STRTGY Timer Design System

This document captures the current visual language of the app so future changes stay consistent with the existing product.

## Principles

- Keep the interface minimal, quiet, and utility-first.
- Use contrast through typography and spacing before using decoration.
- Avoid cards, shadows, gradients, or heavy chrome unless there is a clear functional reason.
- Prefer transparent surfaces with thin borders.
- Let the timer, numbers, and session data remain the visual focus.

## Visual Tone

- Minimal productivity tool
- Editorial but functional
- Mostly monochrome with one accent color
- Dense enough for data, but never cramped

## Color Tokens

Light mode:

- `--bg-color`: `#ffffff`
- `--text-color`: `#000000`
- `--muted-text`: `rgba(0, 0, 0, 0.4)`
- `--circle-bg`: `rgba(0, 0, 0, 0.02)`
- `--circle-stroke`: `rgba(0, 0, 0, 0.08)`
- `--pie-fill`: `rgba(255, 233, 0, 0.15)`
- `--progress-color`: `#FFE900`
- `--btn-border`: `rgba(0, 0, 0, 0.1)`
- `--stats-border`: `rgba(0, 0, 0, 0.1)`
- `--ratio-positive`: `#14804a`
- `--ratio-negative`: `#c03a2b`

Dark mode:

- `--bg-color`: `#0a0a0a`
- `--text-color`: `#ffffff`
- `--muted-text`: `rgba(255, 255, 255, 0.4)`
- `--circle-bg`: `rgba(255, 255, 255, 0.02)`
- `--circle-stroke`: `rgba(255, 255, 255, 0.08)`
- `--btn-border`: `rgba(255, 255, 255, 0.1)`
- `--stats-border`: `rgba(255, 255, 255, 0.1)`
- `--ratio-positive`: `#6dd59c`
- `--ratio-negative`: `#ff8a80`

## Typography

Sans stack:

- `system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`

Mono stack:

- `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

Type roles:

- Primary screen title: `18px`, `600`
- Section labels / metadata: `10px` to `11px`, muted, often uppercase
- Body UI text: `11px` to `12px`
- Timer numerals: large mono numerals
- Numeric tables: always use tabular numerals

Rules:

- Use uppercase only for small labels, headers, and controls.
- Use muted text for metadata, not for important values.
- Use body weight and scale, not color, to establish hierarchy wherever possible.

## Spacing

Base spacing rhythm:

- `4px`
- `8px`
- `10px`
- `12px`
- `16px`
- `20px`
- `24px`

Rules:

- Default control padding: `4px 8px`
- Compact input padding: `8px`
- Major screen gap: `16px` to `20px`
- Table row vertical padding: `4px` to `10px`

## Borders and Corners

- Default border: `1px solid var(--btn-border)` or `var(--stats-border)`
- Default radius: `4px`
- Larger radius should be avoided unless already present in the timer composition

Rules:

- Buttons and inputs should use `4px` corners.
- Tables and text sections should usually avoid boxed cards.
- Prefer separators and whitespace over containers.

## Buttons

### Primary Accent Button

Used for:

- `New Session`
- active duration button
- active play state

Style:

- Background: `var(--progress-color)`
- Border: `1px solid var(--progress-color)`
- Text: black
- Radius: `4px`
- Padding: `4px 8px`
- Font size: `10px`
- Uppercase

### Secondary Utility Button

Used for:

- `Clear`
- `Export CSV`
- passive utility actions

Style:

- Transparent background
- Thin muted border
- Muted text
- Same size and radius as primary buttons

Rules:

- Keep all utility buttons visually consistent.
- Avoid oversized pill buttons.

## Inputs and Forms

Textareas and text inputs:

- Transparent background
- Thin border
- `4px` radius
- Compact padding
- Same border language as utility buttons

Question labels:

- `11px`
- Normal sentence case
- Simple, direct wording
- No decorative card treatment

Reflection forms:

- Should feel like an extension of the session screen, not a modal or card stack
- Use spacing and text hierarchy, not large containers

## Tables and Data Rows

Main sessions table layout:

- Session label column: `minmax(0, 1.5fr)`
- Numeric columns: `repeat(3, minmax(0, 0.8fr))`

Rules:

- All numeric values must align right.
- All table rows, footer totals, and expanded detail rows should use the same visual grid where applicable.
- Session detail rows should feel flatter than cards.
- Use separators sparingly. Avoid double borders.

## Ratio Semantics

- Positive ratio: green
- Negative ratio: red
- Neutral / empty: muted

Rules:

- Ratio is the only recurring semantic color besides the yellow accent.
- Do not introduce more semantic colors unless there is a strong need.

## Timer Screen

The timer screen should remain the emotional center of the app.

Rules:

- Keep the circle large and visually calm.
- Standby state should be visibly quieter than focus state.
- Play/pause transitions should feel instant.
- Avoid adding interface clutter around the timer.

## Expanded Session Content

When showing saved session details:

- Show the task first
- Show reflections next
- Show interval rows after

Rules:

- Task and reflection text should look like plain, minimal content blocks
- Do not render them as heavy cards
- Match the tone of the live session questions

## Interaction Patterns

- Hover effects should be subtle
- Hidden row actions may appear on hover
- Keyboard shortcuts must never interfere with typing fields
- Completion events must be visible through notification and optionally sound

## Do

- Reuse existing tokens before adding new ones
- Match button sizing exactly
- Keep forms simple
- Use whitespace and borders for structure
- Keep copy concise and direct

## Don’t

- Add random card backgrounds
- Introduce new radii casually
- Use bright colors beyond the yellow accent and ratio states
- Mix multiple visual languages in the same screen
- Over-style saved session content

## Component Checklist

Before adding a new UI piece, check:

- Does it use existing color tokens?
- Does it use `4px` corners if interactive?
- Is the border the same thin border used elsewhere?
- Is the text hierarchy consistent with session/task/reflection content?
- Can this be solved with spacing instead of a card?
- Does it align with the table grid if it belongs to session data?

## Source of Truth

If this document and the shipped UI diverge, the current shipped UI should be treated as the source of truth unless an explicit redesign is underway.
