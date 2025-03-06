# 3D SaaS Public Square Marketplace

A virtual 3D marketplace where vendors can set up stalls and showcase their products in an immersive environment.

## Features

- 3D virtual town square environment with vendor stalls
- User authentication for visitors and vendors
- Vendor profile and stall customization
- Navigation system for exploring the square
- Interaction with vendor stalls
- Analytics tracking for vendor stall visits

## Tech Stack

- **Frontend**: Next.js with TypeScript and App Router
- **Backend/Database**: Supabase
- **3D Rendering**: Three.js with React Three Fiber
- **Styling**: TailwindCSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/3d-marketplace.git
cd 3d-marketplace
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Setup

1. Create a new Supabase project
2. Set up the following tables:

### Profiles Table

- id (uuid, primary key, references auth.users.id)
- updated_at (timestamp with time zone)
- username (text)
- full_name (text)
- avatar_url (text)
- is_vendor (boolean)

### Vendors Table

- id (uuid, primary key)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)
- name (text)
- description (text)
- user_id (uuid, references auth.users.id)
- logo_url (text)

### Stalls Table

- id (uuid, primary key)
- created_at (timestamp with time zone)
- vendor_id (uuid, references vendors.id)
- position_x (float)
- position_y (float)
- position_z (float)
- rotation_y (float)
- color (text)
- stall_type (integer)
- name (text)

### Products Table

- id (uuid, primary key)
- created_at (timestamp with time zone)
- vendor_id (uuid, references vendors.id)
- name (text)
- description (text)
- price (float)
- image_url (text)

### Stall Analytics Table

- id (uuid, primary key)
- created_at (timestamp with time zone)
- stall_id (uuid, references stalls.id)
- visitor_id (uuid, references auth.users.id)
- interaction_type (text)
- duration (float)

## Project Structure

```
3d-marketplace/
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   │   ├── 3d/        # Three.js components
│   │   ├── auth/      # Authentication components
│   │   ├── layouts/   # Layout components
│   │   └── ui/        # UI components
│   └── lib/           # Utility functions and types
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- [TailwindCSS](https://tailwindcss.com/)
# game-directory
# game-directory
# game-market
