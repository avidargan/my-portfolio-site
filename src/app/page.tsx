'use client';
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { DynamicAnimationOptions, motion, stagger, useAnimate, useInView } from "framer-motion";

enum Direction {
  "left", "right"
}
interface DevBannerProps {
  transformTemplate:(transform: any, generatedTransform: string) => string,
  direction: Direction,
}

function DevInProgBanner({transformTemplate, direction}: DevBannerProps) {
  return (
    <motion.div
      transformTemplate={transformTemplate}
      className={`${styles.dipShadowWrap}` + `${direction == Direction.left ? " leftBanner" : " rightBanner"}`}>
      <div className={styles.dipBanner}>
          {[...Array(15)].map((val, index) =><span aria-hidden key={index + '_child'} className={styles.dipText}>SOFTWARE DEVELOPMENT IN PROGRESS</span>)}
      </div>
    </motion.div>
  )
}

function DancingDownArrow() {
  return (
    <motion.span
      className={styles.helloScrollIcon}
      animate={{y: [-5, 25]}}
      transition={{repeat: Infinity, repeatType: "reverse", ease: "easeInOut",duration: 1}}
    >
      ↓
    </motion.span>)
}

export default function Home() {

  const [ scope, animator ] = useAnimate();
  const viewRef = useRef(null);
  const isInView = useInView(viewRef, {amount: 0.1, once: true});

  const pretransform = (_: any, generated: string) => `perspective(10cm) rotate(var(--tapeAngle)) translate3D(0, 0, var(--tapeDepth)) ${generated}`

  const bannerAnimOptions: DynamicAnimationOptions = {ease: "easeInOut", duration: 1.4, delay: stagger(0.2, {startDelay: 0.8, from: "first"})}

  useEffect(() => {
      let leftAnim = animator(".leftBanner", { x: "120vw" }, bannerAnimOptions);
      let rightAnim = animator(".rightBanner", { x: "-120vw" }, bannerAnimOptions);
      if (isInView) {
        leftAnim.play();
        rightAnim.play();
      } else {
          leftAnim.stop();
          rightAnim.stop();
      }
  }, [isInView, animator, bannerAnimOptions]);

  return (
    <main ref={scope}className={styles.main}>
      <section className={styles.intro}>
        <h1 className={styles.helloHeader}>Hello, my name is <span className={styles.helloName}>Avi  Dargan</span></h1>
        <h2 className={styles.helloSubheader}>Software Engineer</h2>
        <div className={styles.helloScrollNotice}><DancingDownArrow/>see my work<DancingDownArrow/></div>

      </section>
      <section ref={viewRef} className={styles.hiddenProjectBackground}>
        {[...Array(8)].map((val, index) =>
          <DevInProgBanner
            key={index}
            direction={index % 2 == 0 ? Direction.left : Direction.right}
            transformTemplate={pretransform}
          />
        )}
      </section>
    </main>
  );
}
