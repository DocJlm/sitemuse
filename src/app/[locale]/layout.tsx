import { Suspense, type ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import localFont from "next/font/local";
import { isLocale } from "@/lib/catalog";
import { copy } from "@/lib/i18n";
import { Header } from "@/components/header";
import { SavedProvider, StorageNotice } from "@/components/saved";
import "../globals.css";
const geist = localFont({
  src: "../../fonts/geist.woff2",
  variable: "--font-geist",
  display: "swap",
});
export const metadata = {
  title: { default: "SiteMuse · 网页灵感馆", template: "%s | SiteMuse" },
};
export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}
export const dynamicParams = false;
export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy(locale);
  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"}>
      <body className={geist.variable}>
        <SavedProvider>
          <a className="skip-link" href="#main">
            {t.skip}
          </a>
          <div className="shell">
            <Suspense fallback={<div className="header">SiteMuse.</div>}>
              <Header locale={locale} />
            </Suspense>
            <StorageNotice locale={locale} />
            <main id="main">{children}</main>
            <footer className="footer">
              <div>
                <Link href={`/${locale}`} className="footer-brand">
                  SiteMuse.
                </Link>
                <p>{t.footer}</p>
              </div>
              <div className="footer-links">
                <Link href={`/${locale}/about`}>{t.about}</Link>
                <a
                  href="https://github.com/DocJlm/sitemuse"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub ↗
                </a>
                <span>{t.rights}</span>
              </div>
            </footer>
          </div>
        </SavedProvider>
      </body>
    </html>
  );
}
