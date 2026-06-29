import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
  buildParticles,
  runParticleScatter,
  resizeScatterCanvas,
} from "../utils/particleScatter";

const BG = "#0A0E1A";

export default function LandingPage() {
  const navigate = useNavigate();
  const skippedRef = useRef(false);
  const sequenceRef = useRef(false);
  const timelineRef = useRef(null);
  const scatterCleanupRef = useRef(null);
  const particlesRef = useRef(null);

  const rootRef = useRef(null);
  const imageWrapRef = useRef(null);
  const canvasRef = useRef(null);
  const heroImageRef = useRef(null);
  const preloadRef = useRef(null);
  const vignetteRef = useRef(null);
  const contentRef = useRef(null);
  const footerRef = useRef(null);
  const labelRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);

  const [imageReady, setImageReady] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const img = preloadRef.current;
    if (img?.complete) setImageReady(true);
  }, []);

  const stopScatter = useCallback(() => {
    scatterCleanupRef.current?.();
    scatterCleanupRef.current = null;
  }, []);

  const startScatter = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !particlesRef.current?.length) return;

    resizeScatterCanvas(canvas);
    scatterCleanupRef.current = runParticleScatter(
      canvas,
      particlesRef.current,
      {
        duration: 1400,
        onComplete: () => {
          gsap.to(canvas, { opacity: 0, duration: 0.5, ease: "power2.out" });
        },
      },
    );
  }, []);

  const handleSkip = useCallback(() => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    timelineRef.current?.kill();
    stopScatter();
    audioRef.current?.stop?.();
    navigate("/dashboard");
  }, [stopScatter, navigate]);

  useEffect(() => {
    if (!imageReady || sequenceRef.current) return undefined;
    sequenceRef.current = true;

    const ctx = gsap.context(() => {
      const image = heroImageRef.current;
      if (image) {
        particlesRef.current = buildParticles(
          image,
          window.innerWidth,
          window.innerHeight,
          1.72,
        );
      }

      gsap.set([contentRef.current, footerRef.current], { opacity: 0, y: 28 });
      gsap.set(canvasRef.current, { opacity: 0 });
      gsap.set(vignetteRef.current, { opacity: 0 });
      gsap.set(imageWrapRef.current, {
        scale: 1,
        opacity: 1,
        transformOrigin: "center center",
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          if (!skippedRef.current) navigate("/dashboard");
        },
      });

      timelineRef.current = tl;

      // Text in
      tl.to(
        contentRef.current,
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        0.3,
      )
        .to(
          footerRef.current,
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          0.45,
        )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 36, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power4.out" },
          0.35,
        )

        // Text out
        .to(
          [contentRef.current, footerRef.current],
          { opacity: 0, y: -10, duration: 0.55, ease: "power2.inOut" },
          2.4,
        )

        // Cinematic zoom — slow start, accelerates into the tunnel
        .to(
          imageWrapRef.current,
          { scale: 1.85, duration: 1.5, ease: "power2.in" },
          3,
        )
        .to(
          vignetteRef.current,
          { opacity: 0.9, duration: 1.5, ease: "power2.out" },
          3,
        )

        // Dissolve into particles — crossfade
        .to(
          imageWrapRef.current,
          {
            opacity: 0,
            scale: 1.95,
            filter: "blur(6px)",
            duration: 0.65,
            ease: "power2.inOut",
          },
          4.15,
        )
        .to(
          canvasRef.current,
          { opacity: 1, duration: 0.65, ease: "power2.out" },
          4.15,
        )
        .add(() => startScatter(), 4.15)

        // Dashboard emerges beneath scattering particles
        // Navigate to dashboard as particles scatter
        .add(() => {
          if (!skippedRef.current) navigate("/dashboard");
        }, 4.35)

        // Landing lifts away
        .to(
          rootRef.current,
          { opacity: 0, duration: 0.85, ease: "power2.inOut" },
          5.75,
        );
    }, rootRef);

    return () => {
      timelineRef.current?.kill();
      stopScatter();
      ctx.revert();
    };
  }, [imageReady, startScatter, stopScatter, navigate]);

  useEffect(() => {
    if (!soundEnabled || !imageReady || skippedRef.current) return undefined;

    let audioContext;
    let gainNode;
    let fadeTimer;

    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = audioContext.createGain();
      gainNode.gain.value = 0;
      gainNode.connect(audioContext.destination);

      const noiseBuffer = audioContext.createBuffer(
        1,
        audioContext.sampleRate * 2,
        audioContext.sampleRate,
      );
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < output.length; i += 1)
        output[i] = (Math.random() * 2 - 1) * 0.08;

      const noise = audioContext.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const lowpass = audioContext.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 180;
      noise.connect(lowpass);
      lowpass.connect(gainNode);
      noise.start();

      const rumble = audioContext.createOscillator();
      rumble.type = "sine";
      rumble.frequency.value = 42;
      const rumbleGain = audioContext.createGain();
      rumbleGain.gain.value = 0.04;
      rumble.connect(rumbleGain);
      rumbleGain.connect(gainNode);
      rumble.start();

      audioRef.current = {
        stop: () => {
          clearTimeout(fadeTimer);
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          try {
            noise.stop();
            rumble.stop();
          } catch {
            /* noop */
          }
          audioContext.close();
        },
      };

      fadeTimer = setTimeout(() => {
        gainNode.gain.linearRampToValueAtTime(
          0.1,
          audioContext.currentTime + 1.2,
        );
      }, 500);
    } catch {
      audioRef.current = null;
    }

    return () => {
      clearTimeout(fadeTimer);
      audioRef.current?.stop?.();
      audioRef.current = null;
    };
  }, [soundEnabled, imageReady]);

  return (
    <div ref={rootRef} className="landing-page" style={{ backgroundColor: BG }}>
      <img
        ref={preloadRef}
        src="/train-mountain.jpg"
        alt=""
        aria-hidden="true"
        className="landing-preload"
        onLoad={() => setImageReady(true)}
      />

      <div className="landing-image-stage">
        <div ref={imageWrapRef} className="landing-image-wrap">
          <img
            ref={heroImageRef}
            src="/train-mountain.jpg"
            alt="Train crossing a mountain bridge"
            className="landing-hero-image"
          />
          <div className="landing-gradient-overlay" />
          <div ref={vignetteRef} className="landing-vignette" />
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="landing-particle-canvas"
        aria-hidden="true"
      />

      <div ref={contentRef} className="landing-content">
        <p ref={labelRef} className="landing-label">
          INDIA&apos;S SMARTEST RAILWAY ASSISTANT
        </p>
        <h1 ref={titleRef} className="landing-title">
          RAILSAGE AI
        </h1>
        <p ref={taglineRef} className="landing-tagline">
          Know before you go.
        </p>
      </div>

      <p ref={footerRef} className="landing-footer">
        Powered by Claude AI · Real-time Indian Railways Data
      </p>

      <button
        type="button"
        className="landing-skip"
        onClick={handleSkip}
        aria-label="Skip intro"
      >
        Skip intro →
      </button>

      <button
        type="button"
        className="landing-sound-toggle"
        onClick={() => setSoundEnabled((prev) => !prev)}
        aria-label={
          soundEnabled ? "Mute ambient sound" : "Enable ambient sound"
        }
      >
        {soundEnabled ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>
    </div>
  );
}

/* Setup LandingPage component structure */

/* Add GSAP animations for landing page */

/* Optimize GSAP animations for performance */
