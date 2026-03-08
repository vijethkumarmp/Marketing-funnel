// HPI 1.7-G
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { TrendingUp, Zap, Target, Activity, ArrowRight, ChevronDown, BarChart3, Layers } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';

// --- Types & Interfaces ---
interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
  color: string;
  id: string;
}

interface Stat {
  value: string;
  label: string;
}

// --- Canonical Data Sources ---
const FEATURES_DATA: Feature[] = [
  {
    icon: Activity,
    title: 'Journey Analytics',
    description: 'Track 10,000+ user journeys across 5 funnel stages with real-time velocity metrics',
    link: '/dashboard',
    color: 'text-accent-hot-pink',
    id: '01'
  },
  {
    icon: TrendingUp,
    title: 'Sankey Flow',
    description: 'Visualize user flow and drop-offs with interactive Sankey diagrams',
    link: '/visualization',
    color: 'text-accent-bright-cyan',
    id: '02'
  },
  {
    icon: Target,
    title: 'Markov Attribution',
    description: 'Calculate channel importance with removal effect analysis',
    link: '/visualization',
    color: 'text-accent-hot-pink',
    id: '03'
  },
  {
    icon: Zap,
    title: 'Friction Reports',
    description: 'Identify revenue leakage and highest-friction points in your funnel',
    link: '/reports',
    color: 'text-accent-bright-cyan',
    id: '04'
  }
];

const STATS_DATA: Stat[] = [
  { value: '10K+', label: 'USER JOURNEYS' },
  { value: '5', label: 'FUNNEL STAGES' },
  { value: '4', label: 'CHANNELS' },
  { value: '$150', label: 'AVG ORDER VALUE' }
];

// --- Components ---

const Marquee = ({ text, direction = 1 }: { text: string; direction?: number }) => {
  return (
    <div className="relative flex overflow-hidden bg-accent-hot-pink py-4 border-y-4 border-base-white">
      <motion.div
        className="flex whitespace-nowrap font-heading text-2xl text-base-black uppercase tracking-wider"
        animate={{ x: direction === 1 ? [0, -1000] : [-1000, 0] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {Array(10).fill(text).map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-4">
            {item} <span className="w-3 h-3 bg-base-black rotate-45 block" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const GlitchText = ({ text }: { text: string }) => {
  return (
    <div className="relative inline-block group">
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-accent-bright-cyan opacity-0 group-hover:opacity-100 group-hover:translate-x-[2px] transition-all duration-100 select-none">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-accent-hot-pink opacity-0 group-hover:opacity-100 group-hover:-translate-x-[2px] transition-all duration-100 select-none">
        {text}
      </span>
    </div>
  );
};

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const yHeroText = useTransform(heroScroll, [0, 1], [0, 200]);
  const opacityHero = useTransform(heroScroll, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-base-black text-base-white overflow-clip selection:bg-accent-hot-pink selection:text-base-black">
      <Header />

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative w-full min-h-screen flex flex-col justify-center items-center pt-32 pb-20 px-6 overflow-hidden border-b border-base-white/10">
        {/* Background Grid & Noise */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
        
        {/* Abstract Decorative Elements */}
        <motion.div 
          className="absolute top-1/4 right-0 w-[40vw] h-[40vw] border-[20px] border-accent-bright-cyan/20 rounded-full blur-[100px] pointer-events-none"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 w-full max-w-[120rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 border border-accent-hot-pink text-accent-hot-pink font-paragraph text-xs uppercase tracking-widest">
                  v2.0.4 Stable
                </span>
                <span className="h-px w-20 bg-accent-hot-pink" />
              </div>

              <h1 className="font-heading text-[12vw] lg:text-[9rem] leading-[0.85] tracking-tighter uppercase mix-blend-difference">
                <span className="block text-transparent stroke-text hover:text-base-white transition-colors duration-300" style={{ WebkitTextStroke: '2px white' }}>
                  Neural
                </span>
                <motion.span 
                  style={{ y: yHeroText }}
                  className="block text-accent-hot-pink"
                >
                  Attribution
                </motion.span>
                <span className="block pl-20 lg:pl-40">
                  Funnel
                </span>
              </h1>
            </motion.div>

            <motion.p 
              className="mt-12 font-paragraph text-lg md:text-xl text-base-white/70 max-w-2xl border-l-4 border-accent-bright-cyan pl-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Stop guessing. Start knowing. Enterprise-grade growth analytics powered by Markov Chain modeling and real-time friction analysis.
            </motion.p>

            <motion.div 
              className="mt-12 flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link 
                to="/dashboard"
                className="group relative px-8 py-4 bg-base-white text-base-black font-heading text-lg uppercase overflow-hidden"
              >
                <span className="relative z-10 group-hover:text-base-white transition-colors duration-300">Launch Dashboard</span>
                <div className="absolute inset-0 bg-accent-hot-pink transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
              <Link 
                to="/visualization"
                className="group px-8 py-4 border-2 border-base-white text-base-white font-heading text-lg uppercase hover:bg-base-white hover:text-base-black transition-all duration-300"
              >
                View Analytics
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual / 3D Abstract */}
          <div className="lg:col-span-4 relative h-[50vh] lg:h-auto flex items-center justify-center">
             <motion.div
               className="relative w-full aspect-square border-4 border-base-white/10 p-4"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1, delay: 0.5 }}
             >
                <div className="absolute inset-0 border border-accent-bright-cyan/30 transform rotate-6 scale-95" />
                <div className="absolute inset-0 border border-accent-hot-pink/30 transform -rotate-3 scale-105" />
                <Image 
                  src="https://static.wixstatic.com/media/ba2849_1f210de2812a493aa0203509cf40984a~mv2.png?originWidth=576&originHeight=576"
                  alt="Dashboard Preview Abstract"
                  className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute bottom-0 right-0 bg-base-black p-4 border-t-2 border-l-2 border-base-white">
                  <Activity className="w-8 h-8 text-accent-bright-cyan animate-pulse" />
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* --- MARQUEE SEPARATOR --- */}
      <Marquee text="VELOCITY TRACKING • REVENUE LEAKAGE • PROPENSITY SCORING • MARKOV CHAINS" />

      {/* --- PHILOSOPHY / LEAKY BUCKET SECTION --- */}
      <section className="w-full py-32 px-6 border-b border-base-white/10 bg-base-black relative">
        <div className="max-w-[120rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="sticky top-32 self-start">
            <h2 className="font-heading text-6xl md:text-8xl mb-8 leading-none">
              THE <span className="text-accent-bright-cyan">LEAKY</span><br />BUCKET
            </h2>
            <p className="font-paragraph text-xl text-base-white/80 mb-12 max-w-xl">
              Most analytics tools tell you <strong>what</strong> happened. We tell you <strong>why</strong> you lost money. 
              Quantify the "Economic Cost of Friction" and identify the exact moment a lead goes cold.
            </p>
            <div className="flex flex-col gap-4">
              {['Awareness', 'Interest', 'Consideration', 'Intent', 'Conversion'].map((stage, i) => (
                <div key={stage} className="flex items-center gap-4 group cursor-default">
                  <span className="font-heading text-base-white/30 group-hover:text-accent-hot-pink transition-colors">0{i + 1}</span>
                  <div className="h-px flex-grow bg-base-white/20 group-hover:bg-accent-hot-pink transition-colors" />
                  <span className="font-heading text-xl uppercase group-hover:translate-x-2 transition-transform">{stage}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
             {/* Visual representation of data flow/leakage */}
             <div className="grid grid-cols-1 gap-8">
                <div className="bg-base-white/5 border border-base-white/10 p-8 hover:border-accent-bright-cyan transition-colors duration-300">
                  <div className="flex justify-between items-start mb-8">
                    <BarChart3 className="w-12 h-12 text-accent-bright-cyan" />
                    <span className="font-paragraph text-xs text-base-white/50">LIVE METRIC</span>
                  </div>
                  <h3 className="font-heading text-3xl mb-2">TIME-TO-CONVERSION</h3>
                  <p className="font-paragraph text-base-white/60 mb-6">Identify the "Golden Window" for follow-ups.</p>
                  <div className="w-full bg-base-white/10 h-2 mb-2">
                    <motion.div 
                      className="h-full bg-accent-bright-cyan"
                      initial={{ width: 0 }}
                      whileInView={{ width: '70%' }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                    />
                  </div>
                  <div className="flex justify-between font-paragraph text-xs">
                    <span>0h</span>
                    <span>4.2h (Optimal)</span>
                    <span>24h</span>
                  </div>
                </div>

                <div className="bg-base-white/5 border border-base-white/10 p-8 hover:border-accent-hot-pink transition-colors duration-300 translate-x-0 lg:translate-x-12">
                  <div className="flex justify-between items-start mb-8">
                    <Layers className="w-12 h-12 text-accent-hot-pink" />
                    <span className="font-paragraph text-xs text-base-white/50">ANALYSIS</span>
                  </div>
                  <h3 className="font-heading text-3xl mb-2">MICRO-SIGNALS</h3>
                  <p className="font-paragraph text-base-white/60 mb-6">Track high-intent behaviors before the form fill.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-base-black p-4 border border-base-white/20">
                      <div className="text-2xl font-heading text-accent-hot-pink">70%</div>
                      <div className="text-xs text-base-white/50">SCROLL DEPTH</div>
                    </div>
                    <div className="bg-base-black p-4 border border-base-white/20">
                      <div className="text-2xl font-heading text-accent-hot-pink">30s+</div>
                      <div className="text-xs text-base-white/50">DWELL TIME</div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION (MAGAZINE FLOW) --- */}
      <section className="w-full py-32 px-6 bg-base-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-base-white/10 hidden md:block" />
        
        <div className="max-w-[120rem] mx-auto">
          <div className="text-center mb-32">
            <h2 className="font-heading text-5xl md:text-7xl uppercase">
              System <span className="text-accent-hot-pink">Capabilities</span>
            </h2>
          </div>

          <div className="flex flex-col gap-0">
            {FEATURES_DATA.map((feature, index) => (
              <div key={index} className="group relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 py-24 border-t border-base-white/10">
                {/* Content Side */}
                <div className={`flex flex-col justify-center ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`font-heading text-6xl opacity-20 ${feature.color}`}>{feature.id}</span>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="font-heading text-4xl md:text-5xl mb-6 group-hover:translate-x-2 transition-transform duration-300">
                    <GlitchText text={feature.title} />
                  </h3>
                  <p className="font-paragraph text-lg text-base-white/70 mb-8 max-w-md">
                    {feature.description}
                  </p>
                  <Link 
                    to={feature.link}
                    className="inline-flex items-center gap-2 font-heading text-sm uppercase tracking-widest hover:gap-4 transition-all text-accent-bright-cyan"
                  >
                    Explore Module <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Visual Side */}
                <div className={`relative h-[400px] md:h-[500px] overflow-hidden border-2 border-base-white/10 group-hover:border-base-white/30 transition-colors ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br from-base-black to-transparent z-10 opacity-50`} />
                  <Image 
                    src="https://static.wixstatic.com/media/ba2849_57f1b90c581e4f97a5ee054c76b3d042~mv2.png?originWidth=768&originHeight=448"
                    alt={feature.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Overlay UI Elements */}
                  <div className="absolute bottom-0 left-0 w-full p-6 z-20 border-t border-base-white/10 bg-base-black/80 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-paragraph text-xs uppercase text-base-white/50">Module Status</span>
                      <span className="flex items-center gap-2 font-paragraph text-xs text-accent-bright-cyan">
                        <span className="w-2 h-2 bg-accent-bright-cyan rounded-full animate-pulse" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS SECTION (BRUTALIST GRID) --- */}
      <section className="w-full border-y border-base-white/10 bg-base-white/5">
        <div className="max-w-[120rem] mx-auto grid grid-cols-2 md:grid-cols-4">
          {STATS_DATA.map((stat, index) => (
            <div 
              key={index} 
              className={`
                relative p-12 md:p-16 flex flex-col items-center justify-center text-center group
                ${index !== STATS_DATA.length - 1 ? 'border-r border-base-white/10' : ''}
                ${index < 2 ? 'border-b md:border-b-0 border-base-white/10' : ''}
              `}
            >
              <div className="absolute inset-0 bg-accent-hot-pink/0 group-hover:bg-accent-hot-pink/10 transition-colors duration-300" />
              <span className="font-heading text-5xl md:text-7xl text-base-white mb-4 group-hover:scale-110 transition-transform duration-300 block">
                {stat.value}
              </span>
              <span className="font-paragraph text-xs md:text-sm uppercase tracking-widest text-accent-bright-cyan">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="w-full py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-hot-pink transform -skew-y-2 scale-110 z-0" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-6xl md:text-8xl text-base-black mb-8 leading-[0.9]">
              READY TO <br />
              <span className="text-base-white stroke-text" style={{ WebkitTextStroke: '2px black' }}>DISRUPT</span> THE FUNNEL?
            </h2>
            <p className="font-paragraph text-xl md:text-2xl text-base-black/80 mb-12 max-w-2xl mx-auto font-bold">
              Start analyzing your user journeys with enterprise-grade attribution modeling today.
            </p>
            
            <Link 
              to="/dashboard"
              className="inline-block bg-base-black text-base-white px-12 py-6 font-heading text-xl uppercase hover:bg-base-white hover:text-base-black transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
            >
              Get Started Now
            </Link>
          </motion.div>
        </div>

        {/* Decorative Noise Overlay on CTA */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </section>

      <Footer />
      
      <style>{`
        .stroke-text {
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}