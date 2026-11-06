# TypingBull design system

This describes the design the site actually ships. (An earlier version of this file described a different, Vercel-style system that was never built.)

## Product and world
TypingBull is a free, gamified touch-typing site for kids, adults and teachers. The world is **a night-time railway journey** ("The Great Typing Railway"): stars, mountain ridgelines, a rail line, and **Bully the Bull**, a round friendly mascot. Utility pages (typing test, speed benchmark) borrow the same scene so the whole site reads as one place.

Surface modes: the dashboard is Persuade-then-Operate (one clear next step, then tools), the typing test is Operate, the average-speed and guide pages are Read.

## Colour
- Defined as tokens in `src/index.css` (`--color-*`), with light and dark sets. Dark (night) is the default look.
- Neutrals are slate: ink `#0F172A` / `#F8FAFC`, body `#334155` / `#CBD5E1`, mute `#64748B` / `#94A3B8`. Text must stay at 4.5:1 or better on its surface.
- Accent roles (each has a halo, a tinted badge background and a badge border token):
  - **Orange / amber**: the single primary action (start, continue, learn). Gradient `amber-500 → orange-500`, dark text.
  - **Purple**: the typing test and focus states (rings, active chips).
  - **Green**: success, accuracy, the Test section. **Pink**: play and mistakes. **Blue**: classroom. **Red**: weak keys.
- Per-section nav colours live in `Sidebar.tsx` and `BottomNav.tsx`.
- Colour never carries meaning alone: errors also get an underline, states also get text.

## Type
- **Nunito** (400, 600, 700, 800, 900) for everything; headings are 800–900 weight. **JetBrains Mono** only for the typing passage.
- Scale in use: page title `text-3xl sm:text-5xl`, section title `text-xl sm:text-2xl`, body `text-sm sm:text-base`, minimum `text-xs` (12px). Do not go below 12px.
- Headings use `text-balance`; running text stays near 65 characters wide.

## Shape, depth and surfaces
- Heavy rounding: `rounded-2xl` for controls and cards, `rounded-3xl` for panels and scene banners, full pills for buttons and chips.
- **`.card-game`**: the standard glass card (blurred translucent background, 2px light border, soft offset shadow) with an optional colour halo (`.card-halo-orange|purple|green|pink|blue|red|gold`). It lifts on hover and presses on click, so it is for things you click.
- **`.card-game.card-static`**: the same card for content (text, tables, the typing box). No lift or press.
- **Orbs**: round `card-game` tiles (96px) for single stats such as streak, accuracy, mistakes.
- Shadows have an offset and blur; no hard offset shadows, no gradient text, no nested cards.

## Signature components
- **Mascot** (`Mascot.tsx`): moods `idle | happy | cheering | sad | thinking | typing`. One mascot per screen region; on result screens the result's mascot replaces the header one.
- **SceneBanner** (`SceneBanner.tsx`): night sky, two ridgelines and a rail line as an SVG header with the bull beside the track. Always dark, with fixed light text.
- **SpeedGauge** (`SpeedGauge.tsx`): six speed levels as a coloured bar with a marker at the visitor's WPM.
- **Typing test** (`TypingTest.tsx`): three-line passage box, live timer / WPM / accuracy, result screen with count-up, level gauge, share card and next steps.

## Layout and navigation
- Desktop: left sidebar with labelled items. Phone: bottom bar with five items (Home, Learn, Play, Test, More); the rest sit in the More menu.
- Phone first screen on the typing test is the test box itself: header copy is shortened and the mascot hidden.
- Floating BullBot is hidden on focus routes (typing, games, classroom, test and benchmark pages) on phones.

## Motion
- One authored moment per view: mascot idle motion, the WPM count-up, the gauge marker slide. Springs for taps, ease-out for reveals.
- Everything that animates must have a `prefers-reduced-motion` fallback (the count-up jumps to the value; the gauge marker has `motion-reduce:transition-none`).

## Accessibility floor
- Tap targets at least 44px on phones. Visible focus ring on every control (purple outline/ring). One tab stop per control: motion wrappers inside links use `tabIndex={-1}`.
- Icons are `lucide-react` with `aria-hidden` when decorative; no emoji as UI icons. Emoji appear only in content (mascot copy, lesson titles).
- Screen readers get a plain sentence for animated results; the typing passage is readable and described by the input.

## Do and don't
- Do keep exactly one primary orange action per screen.
- Do reuse `card-game`, the halos and the mascot before inventing new surfaces.
- Don't add a second accent for the same role, ghost watermark shapes behind cards, or section eyebrows above headings.
- Don't write copy that scolds: low scores get encouragement and a next step.
