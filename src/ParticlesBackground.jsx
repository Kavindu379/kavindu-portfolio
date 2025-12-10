import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticlesBackground = ({ theme }) => {
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  // DEEP OCEAN COLORS
  const dotColor = theme === 'light' ? '#005c97' : '#64ffda'; // Teal in Dark Mode
  const linkColor = theme === 'light' ? '#cbd5e0' : '#233554'; // Navy lines

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        background: { color: "transparent" },
        particles: {
          number: {
            value: 40,
            density: { enable: true, value_area: 800 }
          },
          color: { value: dotColor },
          shape: { type: "circle" },
          opacity: { value: 0.5, random: false },
          size: { value: 3, random: true },
          links: {
            enable: true,
            distance: 150,
            color: linkColor,
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
          }
        },
        interactivity: {
          events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" },
            resize: true
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 1 } },
            push: { particles_nb: 4 }
          }
        },
        retina_detect: true
      }}
    />
  );
};

export default ParticlesBackground;