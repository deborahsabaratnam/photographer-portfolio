
import { MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router';
import '../styles/Footer.css';

// Photographer's contact details
const contact = {
  whatsapp: '94772499220',
  instagram: 'pradagraph.lk',
  email: 'pradagraphjpg@gmail.com'
};

function Footer() {
  // WhatsApp requires the international number without "+"
  const whatsappLink = `https://wa.me/${contact.whatsapp}`;

  // Instagram profile link
  const instagramLink = `https://www.instagram.com/${contact.instagram}/`;

  // Email link
  const emailLink = `mailto:${contact.email}`;

  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-main">

          {/* BRAND */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              PRADAGRAPH
            </Link>

            <p>
              Capturing moments worth remembering.
            </p>
          </div>

          {/* PAGE LINKS */}
          <nav
            className="footer-column"
            aria-label="Footer navigation"
          >
            <h3>EXPLORE</h3>

            <Link to="/">Home</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          {/* CONTACT LINKS */}
          <div className="footer-column footer-social">
            <h3>CONNECT</h3>

            {/* WHATSAPP */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact PRADAGRAPH on WhatsApp"
            >
              <MessageCircle size={20} strokeWidth={1.8} />
              <span>WhatsApp</span>
            </a>

            {/* INSTAGRAM */}
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit PRADAGRAPH on Instagram"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              <span>Instagram</span>
            </a>

            {/* EMAIL */}
            <a
              href={emailLink}
              aria-label="Email PRADAGRAPH"
            >
              <Mail size={20} strokeWidth={1.8} />
              <span>Email</span>
            </a>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} PRADAGRAPH.
            ALL RIGHTS RESERVED.
          </p>

          <p>
            PHOTOGRAPHY & VISUAL STORYTELLING
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
