export const hubHref = 'https://bookchaowalit.com';
export const contactHref = 'mailto:bookchaowalit.work@gmail.com';
export const portfolioHref = 'https://agency.bookchaowalit.com/agencies';

export default function SiteLinks() {
  return (
    <nav className="site-links" aria-label="ลิงก์เว็บไซต์">
      <a href={hubHref}>bookchaowalit.com</a>
      <a href="https://bookchaowalit.com/privacy">Privacy</a>
      <a href="https://monitor.bookchaowalit.com/">Status</a>
      {/* Intake on a showcase site is closed, so the footer mail link is for feedback about the site, and says so. */}
      <a href={contactHref}>Site feedback</a>
    </nav>
  );
}
