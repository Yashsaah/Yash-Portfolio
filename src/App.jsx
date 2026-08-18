import { MotionConfig } from "framer-motion";

import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";

export default function App() {
  return (
    /* The CSS reduced-motion rule only reaches CSS animations; these are
       JS-driven, so Framer needs telling separately. */
    <MotionConfig reducedMotion="user">
      <Nav />

      <main>
        <Hero />

        {/* Lifted, rounded slab that scrolls up over the pinned hero. */}
        <div className="relative z-10 rounded-t-[1.75rem] bg-ink-800 shadow-[0_-40px_90px_rgba(0,0,0,0.75)] md:rounded-t-[2.5rem]">
          <Skills />
          <Projects />
          <Achievements />
          <Contact />
        </div>
      </main>
    </MotionConfig>
  );
}
