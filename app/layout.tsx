import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="app-header">
          <div className="container app-header__inner">
            <div className="app-header__title">
              <div className="h3">MedAssist AI</div>
              <div className="label">Asistente inteligente de registro clínico</div>
            </div>

            <div className="app-header__right">
              <span className="badge-ai">● IA</span>
            </div>
          </div>
        </header>

        <main className="container">{children}</main>
      </body>
    </html>
  );
}