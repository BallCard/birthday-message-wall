# Gemini Prompts for Birthday Wall Frontend

This document contains 7 copy-paste-ready prompts for generating a complete Vue 3 SPA frontend for the Birthday Wall application.

---

## Prompt 1: Page Background & Overall Layout

```
You are building a Vue 3 SPA for a Birthday Wall application. Generate the full page layout with the following specifications.

## Tech Stack
- Vue 3 with Composition API and `<script setup>` syntax
- Pure CSS (no Tailwind, no SCSS - use plain CSS with CSS variables)
- Mobile-first responsive design
- Single-page full-screen app (no scroll on body, inner scroll areas if needed)

## Requirements

### Background
Create a beautiful, warm birthday-themed background:
- Warm, cozy color palette - think pastel pinks, soft yellows, gentle oranges, cream
- Subtle patterns (confetti, stars, or soft gradients) - use CSS only
- Consider a watercolor or paper texture effect using CSS gradients
- NOT dark or space-themed - this should feel like a warm celebration
- The background should be fixed/cover the entire viewport

### Layout Structure
1. **Header** (fixed at top, ~60px height):
   - Display birthday person's name (e.g., "Happy Birthday, [Name]!")
   - Show message count badge
   - Optional: small decorative elements

2. **Main Wall Area** (flexible height, scrollable):
   - Grid or masonry layout for message cards
   - Empty state design when no messages
   - Loading state with skeleton cards
   - Padding for breathing room

3. **FAB (Floating Action Button)**:
   - Bottom-right corner
   - Icon: plus or message bubble
   - Pulse animation on hover
   - Opens submit form on click

4. **Desktop Pet Area** (fixed at bottom):
   - ~80px height reserved at page bottom
   - Pet will wander within this area
   - Semi-transparent background so pet is always visible

### CSS Variables
Define a complete theming system:
```css
:root {
  --primary-color: /* main accent */;
  --secondary-color: /* secondary accent */;
  --background-color: /* page background */;
  --card-background: /* message card background */;
  --text-primary: /* main text color */;
  --text-secondary: /* muted text color */;
  --border-radius: /* consistent radius */;
  --shadow: /* shadow style */;
  --font-family: /* warm, friendly font stack */;
}
```

### Responsive Breakpoints
- Mobile: < 480px (1-2 columns for cards)
- Tablet: 480px - 768px (2-3 columns)
- Desktop: > 768px (3-4 columns)

## Output
Generate a single Vue component `src/App.vue` that:
- Contains the complete layout structure
- Includes all CSS in `<style scoped>` (or `<style>` for global styles like CSS variables)
- Has placeholder slots/comments for future components: `<MessageWall />`, `<SubmitForm />`, `<DesktopPet />`, `<CelebrationEffect />`
- Uses semantic HTML elements
- Includes basic interaction for the FAB (just a reactive toggle is fine)

Make the design beautiful and polished - this is a birthday celebration app!
```

---

## Prompt 2: Message Card Design

```
You are building a Vue 3 SPA for a Birthday Wall. Generate the MessageCard component.

## Tech Stack
- Vue 3 with Composition API and `<script setup>` syntax
- Pure CSS with scoped styles
- No external dependencies

## API Context
Message data structure:
```typescript
interface Message {
  id: string | number;
  nickname: string;      // max 20 chars
  content: string;       // max 200 chars
  avatar: string;        // one of: cat, dog, rabbit, bear, panda, fox, penguin, owl
  gifts: string[];       // array of gift IDs: cake, candle, flower, balloon, star, firework
  created_at: string;    // ISO timestamp
}
```

## Component Props
```typescript
defineProps<{
  message: Message;
}>();
```

## Component Events
```typescript
const emit = defineEmits<{
  sendGift: [messageId: string | number];
}>();
```

## Design Requirements

### Card Appearance
- Size: approximately 220px wide x 160px tall (adjust for content if needed)
- Style: handwritten note on decorative paper look
  - Slightly rounded corners
  - Subtle paper texture or gradient
  - Maybe a slight shadow for depth
  - Consider a folded corner effect
  - Warm, inviting colors

### Card Content
1. **Avatar** (top-left or top area):
   - Display avatar as an emoji based on the avatar ID:
     - cat → 🐱, dog → 🐶, rabbit → 🐰, bear → 🐻
     - panda → 🐼, fox → 🦊, penguin → 🐧, owl → 🦉
   - Size: 32px - 40px

2. **Nickname** (next to or below avatar):
   - Bold, friendly font
   - Max 20 chars (will be truncated with ellipsis if needed)

3. **Content Preview**:
   - Show full content (max 200 chars)
   - Or truncate to ~100 chars with "..." and click to expand
   - Friendly, readable font

4. **Timestamp**:
   - Relative time (e.g., "2 min ago", "1 hour ago", "Yesterday")
   - Muted color, smaller font
   - Bottom of card

5. **Gifts Received**:
   - Small icons (16px-20px) at the bottom of the card
   - Show each gift as emoji: cake🎂, candle🕯️, flower💐, balloon🎈, star⭐, firework🎆
   - If multiple of same type, show count badge
   - Grouped nicely

### Interactions
1. **Hover Effect**:
   - Subtle lift/shadow increase
   - Slight scale (1.02 - 1.05)
   - Smooth transition

2. **Click Behavior**:
   - Option A: Flip card to show full content and gift button
   - Option B: Expand card in place
   - Choose one approach and implement fully

3. **Gift Button**:
   - Revealed on hover or after click/flip
   - Icon: gift box 🎁 or heart ❤️
   - Emits `sendGift` event with message id

## Output
Generate `src/components/MessageCard.vue` with:
- Complete Vue 3 Composition API code
- Full scoped CSS styles
- Hover animations
- Click/flip interaction
- Time formatting utility (can be inline or separate function)
- Proper TypeScript-style prop definitions (using defineProps with generic)

## Additional Notes
- Make the card feel personal and warm
- Consider adding subtle decorative elements like a paperclip, tape, or sticker effect
- The card should be visually distinct from the background
```

---

## Prompt 3: Gift Icons (6 items)

```
You are building a Vue 3 SPA for a Birthday Wall. Generate animated gift icons using pure CSS.

## Tech Stack
- Pure CSS animations (no images, no Canvas, no JavaScript for animations)
- SVG is acceptable if CSS-only is too limiting
- Icons should work standalone or as inline elements

## Gift Icons Required
Generate 6 animated gift icons (32x32px or 48x48px each):

### 1. Cake (birthday cake 🎂)
- A simple cake shape with candles
- Animation: candles flickering, or cake slightly bouncing

### 2. Candle (flickering candle 🕯️)
- Single candle with flame
- Animation: flame flickering/swaying

### 3. Flower (flower bouquet 💐)
- Simple flower or bouquet shape
- Animation: gentle swaying, or petals slightly moving

### 4. Balloon (colorful balloon 🎈)
- Balloon shape with string
- Animation: gentle floating/bobbing up and down

### 5. Star (twinkling star ⭐)
- Star shape
- Animation: twinkling/pulsing glow

### 6. Firework (firework burst 🎆)
- Firework explosion pattern
- Animation: bursting/expanding particles

## Design Approach
Choose ONE of the following approaches and use it consistently:

**Option A: CSS Shapes**
- Use border-radius, pseudo-elements, and CSS shapes to create each icon
- Most lightweight but limited complexity

**Option B: Inline SVG with CSS Animations**
- Use SVG paths for shapes
- Animate with CSS @keyframes
- More detail possible

**Option C: Emoji with CSS Filter/Animation**
- Use emoji as base
- Add CSS filters and animations
- Simplest but less custom

## Output
Generate a single file `src/components/GiftIcon.vue` OR `src/styles/gift-icons.css` that:
- Contains all 6 icon styles
- Includes all necessary keyframe animations
- Each icon should have a class like `.gift-icon--cake`, `.gift-icon--candle`, etc.
- Include a usage example showing how to display each icon
- Icons should scale well (use relative units or allow size customization)

## Bonus
If using Vue component approach, generate:
```vue
<template>
  <span class="gift-icon" :class="`gift-icon--${type}`"></span>
</template>

<script setup>
defineProps<{
  type: 'cake' | 'candle' | 'flower' | 'balloon' | 'star' | 'firework';
}>();
</script>
```

Make the animations delightful but not distracting - they'll appear multiple times on a page.
```

---

## Prompt 4: Desktop Pet

```
You are building a Vue 3 SPA for a Birthday Wall. Generate a DesktopPet component - a cute animated character that wanders at the bottom of the page.

## Tech Stack
- Vue 3 with Composition API and `<script setup>` syntax
- Pure CSS animations for character movements
- JavaScript for position control and state management
- No external images - use emoji, CSS shapes, or CSS art

## Pet States
The pet has 4 animation states:

1. **Walk**: Pet moves horizontally, walking animation
2. **Idle**: Pet stops, occasionally dozes (eyes close, slight bob)
3. **React**: When clicked - jumps up, waves, hearts appear
4. **Celebrate**: When gift received - jumps with confetti/petals

## Behavior Requirements

### Movement
- Pet wanders randomly within the bottom ~80px of the viewport
- Changes direction randomly every 3-8 seconds
- Occasionally stops to idle/doze
- Movement speed: moderate, not too fast
- Pet should stay within viewport bounds

### Interactions
1. **Click**:
   - Pet jumps up and plays react animation
   - Hearts emit from pet
   - After animation, returns to previous state

2. **New Message Appears**:
   - Pet runs toward the new card's location (if visible)
   - Bounces near the card
   - Returns to wandering

3. **Gift Received** (triggered via method):
   - Pet plays celebrate animation
   - Petal scatter or mini confetti
   - Returns to wandering after

### Exposed Methods
```typescript
const celebrate = () => { /* trigger celebrate animation */ };
const reactToNewMessage = (cardElement: HTMLElement) => { /* run toward card */ };

defineExpose({ celebrate, reactToNewMessage });
```

## Visual Design
Choose a simple, cute character:
- Cat (🐱), Bear (🐻), or Rabbit (🐰)
- Or create a simple CSS art character

The pet should be approximately 40-60px tall.

### Character Implementation Options
1. **Emoji-based**: Use emoji as character, CSS transforms for animations
2. **CSS Art**: Build character with CSS shapes (circles, rounded divs)
3. **Simple SVG**: Inline SVG with CSS animations

## Position Tracking
- Use CSS `transform: translate(x, y)` for movement
- Track position in reactive refs
- Smooth transitions between positions

## Code Structure
Keep JavaScript under 150 lines:
- Use `requestAnimationFrame` for smooth movement
- Or use `setInterval` with CSS transitions
- Clean up timers in `onUnmounted`

## Output
Generate `src/components/DesktopPet.vue` with:
- Complete Vue component
- All 4 animation states with CSS keyframes
- Random wandering logic
- Click interaction
- Exposed methods for external triggers
- Comments explaining key sections

## Tips
- Use `Math.random()` for direction changes
- Use CSS `transition` for smooth position changes
- Consider `will-change: transform` for performance
- Pet should face the direction it's moving
```

---

## Prompt 5: Submit Form

```
You are building a Vue 3 SPA for a Birthday Wall. Generate the SubmitForm component for creating new messages.

## Tech Stack
- Vue 3 with Composition API and `<script setup>` syntax
- Pure CSS with scoped styles
- Form validation (client-side)
- No external form libraries

## API Context

### Config Endpoint
```typescript
// GET /api/config
// Response:
{
  success: true,
  data: {
    passphraseEnabled: boolean,
    birthdayPerson: string
  }
}
```

### Create Message Endpoint
```typescript
// POST /api/messages
// Request body:
{
  nickname: string,    // required, max 20 chars
  content: string,     // required, max 200 chars
  avatar: string,      // required, one of: cat, dog, rabbit, bear, panda, fox, penguin, owl
  passphrase?: string  // required only if passphraseEnabled is true
}

// Success response (201):
{
  success: true,
  data: Message
}

// Error response:
{
  success: false,
  message: string
}
```

## Component Props & Events
```typescript
defineProps<{
  visible: boolean;
  config: {
    passphraseEnabled: boolean;
    birthdayPerson: string;
  };
}>();

const emit = defineEmits<{
  close: [];
  submitted: [message: Message];
}>();
```

## UI Requirements

### Form Style
- Drawer (slides from right) OR Modal (centered overlay) - choose one
- Warm, friendly design matching the birthday theme
- Semi-transparent overlay background
- Close button (X) in top-right corner

### Avatar Selection
- Grid of 8 animal avatars (use emoji):
  - 🐱 cat, 🐶 dog, 🐰 rabbit, 🐻 bear
  - 🐼 panda, 🦊 fox, 🐧 penguin, 🦉 owl
- Selected avatar highlighted with border/ring
- Large, easy to tap (especially on mobile)

### Form Fields
1. **Nickname**:
   - Text input
   - Max 20 characters
   - Character counter shown (e.g., "12/20")
   - Placeholder: "Your name"

2. **Content/Message**:
   - Textarea
   - Max 200 characters
   - Character counter shown (e.g., "85/200")
   - Placeholder: "Write your birthday wish..."
   - Auto-resize height as user types (optional)

3. **Passphrase** (conditional):
   - Only shown when `config.passphraseEnabled === true`
   - Password-type input
   - Placeholder: "Enter the passphrase"
   - Helper text: "Get the passphrase from the birthday person!"

### Submit Button
- Full width or centered
- Text: "Send Wish" or "Post Message"
- Loading state with spinner during submission
- Disabled when form is invalid or loading

### Client-side Validation
- Show validation errors inline
- Real-time validation as user types
- Error states:
  - Nickname empty or too long
  - Content empty or too long
  - Avatar not selected
  - Passphrase empty (if required)

## Interaction
1. Close on:
   - Overlay click
   - Close button click
   - Escape key press
   - After successful submission (after toast)

2. Submit on:
   - Button click
   - Enter key (if focused on input, not textarea)

3. Success feedback:
   - Show toast notification (emit event or use store)
   - Reset form
   - Close drawer/modal

4. Error feedback:
   - Show error message in form
   - Keep form open for user to fix

## Output
Generate `src/components/SubmitForm.vue` with:
- Complete Vue component
- All form fields with validation
- Avatar selection grid
- Submit logic with loading state
- Error handling
- CSS transitions for open/close
- All scoped styles

## Additional Notes
- Focus nickname input when form opens
- Reset form when closing
- Consider showing a preview of the message as user types
- Make the form feel like writing a greeting card
```

---

## Prompt 6: Celebration Effects

```
You are building a Vue 3 SPA for a Birthday Wall. Generate a CelebrationEffect component for full-screen particle animations.

## Tech Stack
- Vue 3 with Composition API and `<script setup>` syntax
- Canvas API OR pure DOM elements (choose one)
- requestAnimationFrame for animations
- Must clean up after animation completes

## Effect Types
Support 3 effect types:

1. **Confetti**: Colorful confetti pieces falling from top
2. **Firework**: Burst of particles from a point (bottom-center or random)
3. **Petal Scatter**: Soft flower petals floating down

## Component Structure
```typescript
// Exposed methods
const trigger = (type: 'confetti' | 'firework' | 'petal') => { /* play animation */ };

defineExpose({ trigger });

// Internal state
const isPlaying = ref(false);
```

## Implementation Requirements

### Canvas Approach (if chosen)
- Single full-screen canvas element
- Particle class or object for each particle
- Support multiple simultaneous particle types
- Clean up: cancel animation frame, clear canvas

### DOM Approach (if chosen)
- Container div with particles as child elements
- CSS keyframes for basic movement
- JS for positioning and cleanup
- Use DocumentFragment for batch DOM operations

### Animation Details

**Confetti**:
- 50-100 pieces
- Various colors: pink, yellow, orange, blue, green
- Rectangles or circles
- Fall with slight rotation
- Duration: 3-5 seconds

**Firework**:
- Start from bottom-center
- Burst into 30-50 particles
- Radial spread
- Fade out as they fall
- Duration: 1-2 seconds
- Multiple colors

**Petal Scatter**:
- 20-40 petal shapes
- Soft pink/white colors
- Gentle floating motion
- Slight rotation
- Duration: 4-6 seconds

### Performance Considerations
- Use requestAnimationFrame
- Clean up particles when off-screen
- Limit max particles if multiple effects trigger
- Remove canvas/DOM elements after animation

## Output
Generate `src/components/CelebrationEffect.vue` with:
- Complete Vue component
- All 3 effect types
- trigger() method exposed
- Proper cleanup
- All styles (minimal if using Canvas)

## Usage Example
```vue
<template>
  <CelebrationEffect ref="celebrationRef" />
</template>

<script setup>
import { ref } from 'vue';
import CelebrationEffect from './CelebrationEffect.vue';

const celebrationRef = ref();

// Trigger celebration
celebrationRef.value?.trigger('firework');
</script>
```

## Notes
- Animation should not block UI interactions
- Multiple triggers should queue or play simultaneously
- Consider reduced motion preference (prefers-reduced-motion)
```

---

## Prompt 7: Full Frontend Integration

```
You are building a Vue 3 SPA for a Birthday Wall. Generate the complete frontend integration code that connects all components together.

## Tech Stack
- Vue 3 with Composition API and `<script setup>` syntax
- Vite as build tool
- Pinia for state management
- Axios for HTTP requests
- Pure CSS (no Tailwind, no SCSS)

## Project Structure
```
src/
├── main.js                 # App entry point
├── App.vue                 # Root component
├── api/
│   └── client.js           # Axios instance
├── stores/
│   └── messages.js         # Pinia store for messages & config
├── components/
│   ├── MessageCard.vue     # (generated in Prompt 2)
│   ├── MessageWall.vue     # Container for all messages
│   ├── SubmitForm.vue      # (generated in Prompt 5)
│   ├── GiftPanel.vue       # Gift selection overlay
│   ├── DesktopPet.vue      # (generated in Prompt 4)
│   ├── CelebrationEffect.vue # (generated in Prompt 6)
│   └── Toast.vue           # Notification component
├── styles/
│   └── main.css            # Global styles, CSS variables
└── assets/
    └── (any static assets)
```

## API Contract

### GET /api/config
```typescript
// Response:
{ success: true, data: { passphraseEnabled: boolean, birthdayPerson: string } }
```

### GET /api/messages?page=1&limit=50
```typescript
// Response:
{
  success: true,
  data: {
    messages: Message[],
    pagination: { page: number, limit: number, total: number, hasMore: boolean }
  }
}
// Messages ordered by created_at descending (newest first)
```

### POST /api/messages
```typescript
// Request:
{ nickname: string, content: string, avatar: string, passphrase?: string }
// Response (201):
{ success: true, data: Message }
```

### GET /api/gifts
```typescript
// Response:
{ success: true, data: [{ id: string, name: string, animation: string }] }
```

### POST /api/gifts/send
```typescript
// Request:
{ messageId: string | number, giftId: string }
// Response:
{ success: true, data: { messageId: string | number, gifts: string[] } }
```

### Error Format
```typescript
// Response (400, 403, 404, 429, 500):
{ success: false, message: string }
```

## Data Model
```typescript
interface Message {
  id: string | number;
  nickname: string;
  content: string;
  avatar: string;
  gifts: string[];
  created_at: string;
}
```

## Files to Generate

### 1. src/main.js
```javascript
// Create Vue app
// Install Pinia
// Mount app
```

### 2. src/App.vue
Assemble all parts:
- Fetch config on mount
- Show header with birthday person name and message count
- MessageWall component
- SubmitForm component (toggle visibility)
- DesktopPet component
- CelebrationEffect component
- Toast notifications
- FAB to open submit form

### 3. src/api/client.js
Axios instance configured with:
- Base URL handling
- Request interceptor for common headers
- Response interceptor for error handling
- Export axios instance

### 4. src/stores/messages.js
Pinia store with:
```typescript
// State
config: { passphraseEnabled: boolean, birthdayPerson: string } | null
messages: Message[]
pagination: { page, limit, total, hasMore }
loading: boolean
error: string | null

// Actions
fetchConfig()
fetchMessages(page?: number)
submitMessage(data: { nickname, content, avatar, passphrase? })
sendGift(messageId, giftId)

// Getters
messageCount
hasMorePages
```

### 5. src/components/MessageWall.vue
- Display all message cards in a grid
- Handle loading state (skeleton cards)
- Handle empty state (friendly message)
- Handle infinite scroll or pagination
- Emit events for gift sending

### 6. src/components/GiftPanel.vue
- Overlay shown when user clicks gift button on a card
- Display 6 gift options (use emoji)
- Close on overlay click
- Emit selected gift

### 7. src/components/Toast.vue
- Simple notification component
- Show success/error messages
- Auto-dismiss after 3-5 seconds
- Stack multiple toasts
- Provide toast() function via composable or store

### 8. vite.config.js
```javascript
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // or your backend URL
        changeOrigin: true
      }
    }
  }
})
```

### 9. index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Birthday Wall</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

## Integration Requirements

### Error Handling
- API errors should show toast notification
- Network errors should show retry option
- Form validation errors shown inline
- Global error boundary for unexpected errors

### Loading States
- Initial load: show skeleton cards
- Submit message: loading button state
- Send gift: loading on gift panel
- Pagination: loading indicator at bottom

### Empty State
- When no messages: show friendly illustration
- Encourage user to post first message
- Maybe show confetti for first message

### State Synchronization
- After submitting message: add to store, scroll to new message
- After sending gift: update message's gifts array
- Handle concurrent updates gracefully

### Toast Notifications
Show toasts for:
- Message submitted successfully
- Gift sent successfully
- API errors
- Network errors

## Output
Generate all files listed above with:
- Complete, working code
- Proper imports and exports
- Error handling
- Loading states
- Empty states
- Comments explaining key integration points

## Notes
- Assume components from Prompts 2-6 already exist
- Show how to import and use them
- Include CSS imports in main.js or App.vue
- Consider adding a simple router if needed (optional, single-page is fine)
```

---

## Usage Instructions

1. **Order**: Execute prompts 1-7 in order, as later prompts depend on earlier outputs.

2. **Component Dependencies**:
   - Prompt 2-6 components are imported in Prompt 7
   - Ensure file paths match the structure in Prompt 7

3. **Customization**: Each prompt can be modified for specific design preferences before sending to Gemini.

4. **Integration**: After generating all files, the app should work with a running backend at `/api/*`.

5. **Testing**: Start with `npm run dev` and test each feature individually.

---

## Additional Notes for Developers

- All prompts assume no TypeScript (JavaScript with JSDoc-style type annotations)
- For TypeScript projects, change `.js` to `.ts` and add proper type definitions
- The design philosophy is "warm, cozy, birthday celebration" - adjust colors and styles accordingly
- Mobile-first: always test on mobile viewport sizes
- Accessibility: prompts include semantic HTML, but add ARIA labels as needed
