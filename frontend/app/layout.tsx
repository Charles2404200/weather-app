import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'Real-time weather forecast application',
  keywords: ['weather', 'forecast', 'temperature', 'app'],
  authors: [{ name: 'Weather App' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="app-header">
          <div className="header-content">
            <h1>🌤️ Weather Forecast</h1>
            <p>Real-time weather data for any location</p>
          </div>
        </header>
        <main className="app-main">
          {children}
        </main>
        <footer className="app-footer">
          <p>&copy; 2024 Weather App. Powered by Open-Meteo API</p>
        </footer>
      </body>
    </html>
  );
}
