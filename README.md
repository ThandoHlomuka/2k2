# 2k2

2k2 is a full-stack marketplace and services platform for users, service
providers, and administrators — combining ecommerce, bookings, messaging,
forums, gigs, experiences, monetization, and wallet-based payments in one
app.

## Ownership & Licensing

**Copyright (c) 2026 Thando Hlomuka. All rights reserved.**

2k2 and all of its source code, styles, assets, database schema, design, and
documentation are the **sole and exclusive intellectual property of Thando
Hlomuka**. This project is released under a **Proprietary / All Rights
Reserved** license. See the [LICENSE](LICENSE) file for the full terms.

Unauthorized copying, cloning, reproduction, redistribution, modification, or
use of this codebase, in whole or in part, for any purpose other than viewing,
is strictly prohibited without the prior written permission of the owner.

## Project Structure

- `index.html` - Main portal (users)
- `provider.html` - Service provider portal
- `admin.html` - Administrator portal
- `login.html`, `register.html`, `onboarding.html`, `upgrade.html` - Auth flows
- `script.js` - Core application logic
- `admin.js`, `admin-upgrades.js` - Admin console logic
- `db.js` - Data models / storage layer
- `config.js` - Application configuration
- `auth.js` - Authentication
- `products.js`, `invoices.js`, `shipping.js`, `monetization.js`,
  `media-player.js`, `presence.js` - Feature modules
- `style.css`, `auth.css` - Styles
- `LICENSE` - Proprietary license (Thando Hlomuka)

## Technology

2k2 is a statically deployed single-page application built with vanilla HTML,
CSS, and JavaScript, using Supabase for authentication and data storage.