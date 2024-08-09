'use client';
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { AnimationSequence, At, DynamicAnimationOptions, motion, stagger, useAnimate, useInView, useReducedMotion } from "framer-motion";

enum Direction {
  "left", "right"
}
interface DevBannerProps {
  transformTemplate: (transform: any, generatedTransform: string) => string,
  direction: Direction,
}
interface ddArrowProps {
  reduceMotion?: boolean | null,
}


function DevInProgBanner({ transformTemplate, direction }: DevBannerProps) {
  return (
    <motion.div
      transformTemplate={transformTemplate}
      className={`${styles.dipShadowWrap}` + `${direction == Direction.left ? " leftBanner" : " rightBanner"}`}>
      <div className={styles.dipBanner}>
        {[...Array(15)].map((val, index) => <div aria-hidden role="presentation" key={index + '_child'} className={styles.dipText}>SOFTWARE DEVELOPMENT IN PROGRESS</div>)}
      </div>
    </motion.div>
  )
}

function DancingDownArrow({ reduceMotion }: ddArrowProps) {
  if (!reduceMotion) {
    return (
      <motion.span
        className={styles.helloScrollIcon}
        animate={{ y: [-5, 25] }}
        transition={{ repeat: Infinity, repeatType: "reverse", ease: "easeInOut", duration: 1 }}
      >
        ↓
      </motion.span>
    )
  } else {
    return (<span className={styles.helloScrollIcon}>↓</span>)
  }
}

export default function Home() {

  const [isMounted, setIsMounted] = useState(false);
  const [scope, animator] = useAnimate();

  const shouldReduceMotion = useReducedMotion();

  const viewRef = useRef<HTMLElement>(null);
  const featuredHeadingRef = useRef<HTMLHeadingElement>(null);
  const liveZoneRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(viewRef, { amount: 0.1, once: true });

  const pretransform = (_: any, generated: string) => `perspective(10cm) rotate(var(--tapeAngle)) translate3D(0, 0, var(--tapeDepth)) ${generated}`


  useEffect(() => {
    const bannerAnimOptions: DynamicAnimationOptions & At = { ease: "easeInOut", duration: 1.4, delay: stagger(0.2, { startDelay: 0.8, from: "first" }), at: "<" };
    const projectAnimOptions: DynamicAnimationOptions = { type: "spring", duration: 1.2, delay: stagger(0.2, { from: "first" }) }
    const footerAnimOptions: DynamicAnimationOptions = { ease: "easeInOut", duration: 0.8 }

    if (!shouldReduceMotion) {
      viewRef?.current?.setAttribute('aria-hidden', 'true');
    }

    const sequence: AnimationSequence = [
      [".leftBanner", { x: "120vw" }, bannerAnimOptions],
      [".rightBanner", { x: "-120vw" }, bannerAnimOptions],
      [".thumb", { y: ["200vh", 0] }, projectAnimOptions],
      [".footer", { width: [0, "200px"] }, footerAnimOptions],
    ]

    let animation = animator(sequence);
    animation.then(() => {
      viewRef?.current?.setAttribute('aria-hidden', 'false');
      featuredHeadingRef?.current?.focus();
      liveZoneRef!.current!.innerText = "";
    });

    if (isInView && !shouldReduceMotion) {
      animation.play();
      liveZoneRef!.current!.innerText = "Loading";
    } else {
      animation.stop();
      liveZoneRef!.current!.innerText = "";
    }
  }, [isInView, animator, shouldReduceMotion]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main ref={scope} className={styles.main}>
      <section className={styles.intro}>
        <h1 className={styles.helloHeader}>Hello, my name is <span className={styles.helloName}>Avi  Dargan</span></h1>
        <h2 className={styles.helloSubheader}>Software Engineer</h2>
        <div className={styles.helloScrollNotice}><DancingDownArrow reduceMotion={shouldReduceMotion} />see my work<DancingDownArrow reduceMotion={shouldReduceMotion} /></div>

      </section>
      <section ref={viewRef} aria-live="polite" className={styles.hiddenProjectBackground}>
        {[...Array(8)].map((val, index) => {
          if (isMounted && !shouldReduceMotion) {
            return (
              <DevInProgBanner
                key={index}
                direction={index % 2 == 0 ? Direction.left : Direction.right}
                transformTemplate={pretransform}
              />
            );
          } else {
            // return(<></>);
          }
        }
        )}
        <div className={styles.featuredProjectsContainer}>
          <h2 tabIndex={-1} ref={featuredHeadingRef} className={`${styles.featuredProjectsHeader}` + " thumb"}>Featured Projects</h2>
          <div className={styles.projectCarousel}>
            <div className={`${styles.projectThumbnail}` + " thumb"}></div>
            <div className={`${styles.projectThumbnail}` + " thumb"}></div>
            <div className={`${styles.projectThumbnail}` + " thumb"}></div>
          </div>
          <h3 className={`${styles.allProjectsLink}` + " thumb"}>All Projects</h3>
        </div>
        <p className={`${styles.pageFooter}` + " footer"}>GitHub | Email me</p>
      </section>
      <div className={styles.visualyHidden} ref={liveZoneRef} aria-live="assertive"></div>
    </main>
  );
}
