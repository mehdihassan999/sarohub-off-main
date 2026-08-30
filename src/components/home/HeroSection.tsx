import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Rocket, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

const DEFAULT_TYPED_PHRASES = [
  "Building Scalable Ventures",
  "Developing AI-Powered Products",
  "Turning Ideas Into Reality",
  "Partnering to Build Technology",
  "Innovating for Tomorrow"
];

interface HeroSectionProps {
  settings?: { [key: string]: string };
}

export default function HeroSection({ settings = {} }: HeroSectionProps) {
  // Parse typed phrases from settings or fall back to defaults
  const typedPhrases: string[] = React.useMemo(() => {
    if (settings.hero_typed_phrases) {
      try {
        const parsed = JSON.parse(settings.hero_typed_phrases);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* ignore */ }
    }
    return DEFAULT_TYPED_PHRASES;
  }, [settings.hero_typed_phrases]);

  const heroHeading = settings.hero_heading || 'Turning Vision Into';
  const heroHeadingAccent = settings.hero_heading_accent || 'Ventures.';
  const heroDescription = settings.hero_description ||
    'We turn ambitious ideas into technology-driven ventures. SaroHub Technologies builds its own products and ventures while partnering with businesses, agencies, and entrepreneurs to transform ideas into scalable digital solutions.';
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullPhrase = typedPhrases[currentPhraseIdx];

    const handleType = () => {
      if (!isDeleting) {
        // Typing characters
        setCurrentText(fullPhrase.substring(0, currentText.length + 1));
        setTypingSpeed(60);

        if (currentText === fullPhrase) {
          // Pause when complete
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, 2500);
          return;
        }
      } else {
        // Deleting characters
        setCurrentText(fullPhrase.substring(0, currentText.length - 1));
        setTypingSpeed(25);

        if (currentText === "") {
          setIsDeleting(false);
          setCurrentPhraseIdx((prev) => (prev + 1) % typedPhrases.length);
          setTypingSpeed(300); // pause before starting next phrase
          return;
        }
      }

      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIdx, typingSpeed]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-14 pb-10 lg:pt-6 lg:pb-0 grid-bg border-b"
      style={{
        backgroundColor: 'var(--bg-app)',
        borderColor: 'var(--border-app)'
      }}
    >
      {/* Immersive background glow effects */}
      <div className="absolute top-1/4 right-1/10 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-20 left-1/10 w-[450px] h-[450px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }} />

      {/* Split Hero Layout: Text Left + Illustration Right */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14 min-h-[calc(100vh-80px)] py-8 lg:py-0">

          {/* Left Content Area */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl lg:max-w-none">

            {/* Positioning badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-semibold tracking-wider uppercase bg-blue-500/8 border border-blue-500/20 text-blue-400 shadow-sm shadow-blue-950/20"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
              <span>Entrepreneurship • Technology • AI • Innovation</span>
            </motion.div>

            {/* Grand Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3rem] xl:text-[3.25rem] font-semibold tracking-[-0.02em] leading-[1.1]"
              style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}
            >
              {heroHeading} <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                {heroHeadingAccent}
              </span>
            </motion.h1>

            {/* Typing animation / Supporting headline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 min-h-[44px] flex items-center justify-center lg:justify-start"
            >
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent inline-flex items-center">
                {currentText}
                <span className="inline-block w-[3px] h-[0.85em] bg-cyan-400 ml-2 animate-pulse" style={{ animationDuration: '0.8s' }} />
              </span>
            </motion.div>

            {/* Supporting description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-sm sm:text-base leading-relaxed font-sans font-medium max-w-xl"
              style={{ color: 'var(--text-body)' }}
            >
              {heroDescription}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-4 w-full sm:w-auto"
            >
              <Link
                to="/services"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-blue-500/20 hover:scale-[1.01] cursor-pointer"
              >
                Explore Our Services
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#ventures"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-transparent rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 border border-white/[0.08] hover:border-blue-500/30 text-white hover:bg-white/[0.02] cursor-pointer"
                style={{
                  color: 'var(--text-main)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <Rocket className="h-4 w-4 text-blue-400" />
                Explore Our Ventures
              </a>
            </motion.div>

            {/* Core pillars instead of fake metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-xs border-t border-white/[0.05] pt-8 w-full max-w-xl"
            >
              <div>
                <span className="block font-bold text-lg text-white">Venture Building</span>
                <span className="text-slate-400 text-[10px] tracking-wider uppercase">Our Own Products</span>
              </div>
              <div className="w-[1px] h-8 bg-white/[0.08]" />
              <div>
                <span className="block font-bold text-lg text-white">Tech Solutions</span>
                <span className="text-slate-400 text-[10px] tracking-wider uppercase">For Businesses</span>
              </div>
              <div className="w-[1px] h-8 bg-white/[0.08]" />
              <div>
                <span className="block font-bold text-lg text-white">Innovation</span>
                <span className="text-slate-400 text-[10px] tracking-wider uppercase">Research & AI</span>
              </div>
            </motion.div>
          </div>

          {/* Right Illustration Area — Animated Robot */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex items-center justify-center w-full max-w-md lg:max-w-none"
          >
            <div className="relative flex items-center justify-center mt-12 lg:-mt-16" style={{ width: '100%', maxWidth: 440 }}>

              {/* Pulsing glow aura behind robot */}
              <motion.div
                animate={{
                  scale: [1, 1.12, 1],
                  opacity: [0.35, 0.55, 0.35],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute rounded-full pointer-events-none -z-10"
                style={{
                  width: '70%',
                  paddingBottom: '70%',
                  top: '15%',
                  left: '15%',
                  background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(56,189,248,0.18) 45%, transparent 75%)',
                  filter: 'blur(60px)',
                }}
              />

              {/* Secondary cyan glow pulse */}
              <motion.div
                animate={{
                  scale: [1.1, 0.95, 1.1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute rounded-full pointer-events-none -z-10"
                style={{
                  width: '50%',
                  paddingBottom: '50%',
                  top: '25%',
                  left: '25%',
                  background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              {/* Orbiting ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute pointer-events-none"
                style={{
                  width: '90%',
                  paddingBottom: '90%',
                  top: '5%',
                  left: '5%',
                }}
              >
                <div
                  className="absolute rounded-full"
                  style={{
                    inset: 0,
                    border: '1px solid rgba(99,102,241,0.12)',
                  }}
                />
                {/* Orbiting dot */}
                <div
                  className="absolute w-2.5 h-2.5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"
                  style={{ top: 0, left: '50%', transform: 'translate(-50%, -50%)' }}
                />
              </motion.div>

              {/* Counter-rotating ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                className="absolute pointer-events-none"
                style={{
                  width: '105%',
                  paddingBottom: '105%',
                  top: '-2.5%',
                  left: '-2.5%',
                }}
              >
                <div
                  className="absolute rounded-full"
                  style={{
                    inset: 0,
                    border: '1px dashed rgba(56,189,248,0.08)',
                  }}
                />
                {/* Orbiting dot */}
                <div
                  className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/40"
                  style={{ bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' }}
                />
              </motion.div>

              {/* Floating robot image */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 mt-2 lg:-mt-8"
              >
                {/* Subtle shadow beneath robot */}
                <motion.div
                  animate={{
                    scaleX: [1, 0.88, 1],
                    opacity: [0.25, 0.15, 0.25],
                  }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{
                    width: '60%',
                    height: 18,
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, transparent 70%)',
                    filter: 'blur(8px)',
                  }}
                />

                <img
                  src="/assets/hero-robot.png"
                  alt="SaroHub Technologies - AI Robot Mascot"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  style={{
                    maxHeight: '440px',
                    filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.25)) drop-shadow(0 0 60px rgba(56,189,248,0.12))',
                  }}
                  loading="eager"
                />

                {/* Eye glow shimmer overlay */}
                <motion.div
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  className="absolute pointer-events-none"
                  style={{
                    top: '18%',
                    left: '30%',
                    width: '40%',
                    height: '15%',
                    background: 'radial-gradient(ellipse, rgba(139,92,246,0.5) 0%, transparent 70%)',
                    filter: 'blur(12px)',
                  }}
                />
              </motion.div>

              {/* Floating accent card — Venture Building */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-2 -right-2 lg:-right-8 px-4 py-3 rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] shadow-lg hidden lg:flex items-center gap-3 z-20"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Venture</p>
                  <p className="text-sm font-black text-white">Building</p>
                </div>
              </motion.div>

              {/* Floating accent card — Technology */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-2 -left-2 lg:-left-8 px-4 py-3 rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] shadow-lg hidden lg:flex items-center gap-3 z-20"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-400 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Technology</p>
                  <p className="text-sm font-black text-white">Partnerships</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
