# Real-Time Shared Grid

A collaborative real-time grid application where users can book and sell grid blocks with live updates, activity tracking, and theme support/

### Features
- __Real-time Collaboration:__ WebSocket-based grid updates using Socket.IO
- __Block Booking & Selling:__ Book empty cells or sell your owned cells
- __Live Activity Board:__ Right-sidebar showing real-time book/sell events
- __User Authentication:__ Login, Signup, and logout via API
- __Color-Coded Cells:__ 
    - Empty(Black)
    - Booked by others(Grey)
    - Booked by user(Green)
- __Dark/Light Theme Support:__ Theme switching with next-themes
- __Microservice Architecture:__ Seperate Socket.IO service for scalability

### Tech Stack
#### Frontend:
- __Next.js:__ React framework
- __TypeScript:__ Type Safety
- __Socket.IO Client:__ Real-time Communication
- __Next-Themes:__ Dark/Light mode
- __TailwindCSS:__ Styling

#### Backend:
- __Node.js + Express:__ HTTP server (microservice)
- __Socket.IO:__ WebSocket Server
- __Prisma ORM:__ Database Client
- __PostgreSQL:__ Database
- __TypeScript:__ Type Safety

### Project Structure
```
real_time_shared_grid/           # Next.js frontend app
├── app/
│   ├── api/                      # API routes (auth, cells)
│   ├── components/               # React components
│   │   ├── Grid.tsx             # Main grid + socket setup
│   │   ├── Cell.tsx             # Individual cell
│   │   ├── ActivityBoard.tsx    # Activity log sidebar
│   │   └── ...
│   ├── lib/
│   │   ├── types.tsx            # TypeScript types
│   │   ├── themes.tsx           # Theme definitions
│   │   ├── socketServer.ts      # Socket initialization (legacy)
│   │   └── db.ts                # Prisma client
│   └── globals.css
├── prisma/
│   └── schema.prisma            # Database schema
└── package.json

socket-service/                   # Separate microservice
├── src/
│   └── index.ts                 # Express + Socket.IO server
├── prisma/
│   └── schema.prisma            # Shared schema
└── package.json
```

### API Routes
Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login and get session
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

Cells:

- `GET /api/cells/book` - Book a cell(legacy, but done via Socket.IO now)
- `GET /api/cells/sell` - Sell a cell(legacy, but done via Socket.IO now)

### Socket.IO Events
Client -> Server
- `request-grid` - Fetch initial grid state
- `book-block` - Book a block
- `sell-block` - Sell a block

Server -> Client
- `grid-state` - Initial grid blocks
- `block-updated` - Block state changed
- `activity` - Book/Sell event

### Database Schema
Users:
```
model User {
  id            String
  email         String (unique)
  username      String?
  passwordHash  String
  ownerships    Ownership[]
  gridBlocks    GridBlock[]
}
```

GridBlocks:
```
model GridBlock {
  blockId   String (primary key like "0-0")
  occupied  Boolean
  owner     String? (references User.email)
  createdAt DateTime
  updatedAt DateTime
}
```

Ownership:
```
model Ownership {
  blockId   String (primary key)
  owner     String (User.email)
  boughtAt  DateTime
  soldAt    DateTime?
}
```

### Known Limitations & Future Improvements
-User validation: Currently checks user exists before booking
-No persistence of user sessions (in-memory)
-Activity board limited to last 20 events
-Grid fixed at 10x10 cells
-No block listing or marketplace features
-No price/monetization system
### License
MIT