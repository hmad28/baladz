# NewsView Specification

## Overview
- Target: `NewsView.tsx`
- Screenshot: `desktop-kajian.png`
- Interaction: click-driven carousel controls

## Structure
Large lead card at left with media placeholder, title, metadata, excerpt, button and dots. Right column stacks five square publication visuals.

## Styles
- Grid: 1.5fr 0.75fr, 72px gap.
- Lead media: 660x440 aspect, pale blue-gray.
- Body: gray text, 14px/1.65.
- Read button: square border, uppercase, compact.
- Dots: 12px circles, selected orange-red.
- Right images: square, 12px vertical gap.

## Responsive
- <= 900px: columns stack; right visuals become a 2-column grid.
- <= 540px: right visuals single column.

