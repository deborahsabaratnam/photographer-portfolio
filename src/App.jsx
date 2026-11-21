import { Routes, Route } from 'react-router';
import { useState, useEffect } from 'react';

import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';

import Navbar from './components/Nav';
import Footer from './components/Footer';
import Intro from './components/Intro';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showIntro && <Intro />}

      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home showIntro={showIntro} />}
        />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;