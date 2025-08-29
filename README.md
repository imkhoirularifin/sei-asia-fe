# SEI Asia Task Manager

## Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Environment Variable Descriptions:

- `NEXT_PUBLIC_API_URL`: The base URL for your backend API server (defaults to `http://localhost:3000`)

## How to Run the Project

### Prerequisites

- Node.js (version 18 or higher)
- pnpm package manager
- Backend API server running (see backend documentation)

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sei-asia-fe
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001) to view the application

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint for code quality checks
