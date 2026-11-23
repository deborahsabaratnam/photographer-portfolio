
import { useState } from 'react';
import '../styles/Contact.css';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/myewbygn';

function Contact() {
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Unable to submit enquiry');
      }

      form.reset();
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        'Your enquiry could not be sent. Please try again.'
      );
    }
  };

  return (
    <main className="contact-page">

      <div className="contact-canvas">

        {/* LEFT - EDITORIAL CONTACT DETAILS */}
        <div className="contact-info">

          <span className="contact-eyebrow">
            PRADAGRAPH / CONTACT
          </span>

          <h1 className="contact-title">
            Let's create
            <br />
            <em>something</em>
            <br />
            timeless.
          </h1>

          <p className="contact-description">
            Every story deserves to be told beautifully.
            Whether it's a special occasion, a creative
            collaboration, or a moment worth remembering,
            I'd love to hear what you have in mind.
          </p>

          <div className="contact-details">

            <span className="contact-details-label">
              LET'S CONNECT
            </span>

            {/* Replace these with the photographer's links */}

            <a href="mailto:your@email.com">
              <span>EMAIL</span>
              <span className="contact-link-arrow">↗</span>
            </a>

            <a
              href="https://www.instagram.com/pradagraph.lk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>INSTAGRAM</span>
              <span className="contact-link-arrow">↗</span>
            </a>

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>WHATSAPP</span>
              <span className="contact-link-arrow">↗</span>
            </a>

          </div>

          <p className="contact-closing">
            Your story. My lens. Something extraordinary.
          </p>

        </div>

        {/* RIGHT - ENQUIRY FORM CANVAS */}
        <div className="contact-form-canvas">

          <div className="contact-form-header">
            <span className="contact-form-eyebrow">
              START A CONVERSATION
            </span>

            <h2>
              Tell me your
              <br />
              <em>story.</em>
            </h2>

            <p>
              Share a few details and I'll get back
              to you as soon as possible.
            </p>
          </div>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="contact-field">
              <label htmlFor="contact-name">
                YOUR NAME *
              </label>

              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-email">
                EMAIL ADDRESS *
              </label>

              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-service">
                PHOTOGRAPHY SERVICE *
              </label>

              <select
                id="contact-service"
                name="service"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select a service
                </option>

                <option value="Portrait Photography">
                  Portrait Photography
                </option>

                <option value="Wedding Photography">
                  Wedding Photography
                </option>

                <option value="Event Photography">
                  Event Photography
                </option>

                <option value="Commercial Photography">
                  Commercial Photography
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="contact-field">
              <label htmlFor="contact-date">
                PREFERRED SHOOT DATE
              </label>

              <input
                id="contact-date"
                type="date"
                name="preferred_date"
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-location">
                SHOOT LOCATION
              </label>

              <input
                id="contact-location"
                type="text"
                name="location"
                placeholder="City or venue"
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message">
                TELL ME ABOUT YOUR VISION *
              </label>

              <textarea
                id="contact-message"
                name="message"
                rows="4"
                placeholder="Tell me about your ideas, your event, or the moments you'd like to capture..."
                required
              />
            </div>

            <button
              type="submit"
              className="contact-submit"
              disabled={status === 'submitting'}
            >
              <span>
                {status === 'submitting'
                  ? 'SENDING...'
                  : 'SEND ENQUIRY'}
              </span>

              <span aria-hidden="true">↗</span>
            </button>

            <div
              className="contact-form-feedback"
              aria-live="polite"
            >
              {status === 'success' && (
                <p className="contact-success">
                  Thank you! Your enquiry has been
                  sent successfully.
                </p>
              )}

              {status === 'error' && (
                <p className="contact-error" role="alert">
                  {errorMessage}
                </p>
              )}
            </div>

          </form>

        </div>

      </div>

    </main>
  );
}

export default Contact;
