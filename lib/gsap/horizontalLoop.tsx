import gsap from "gsap";

export type HorizontalLoopConfig = {
  speed?: number; // pixels per 100px/s speed factor
  repeat?: number; // usually -1 for infinite
  paused?: boolean;
  reversed?: boolean;
  snap?: number | false; // snapping precision (to reduce drift)
  paddingRight?: number; // spacing at end before loop restarts
};

export type LoopTimeline = gsap.core.Timeline & {
  next: (vars?: gsap.TweenVars) => gsap.core.Tween;
  previous: (vars?: gsap.TweenVars) => gsap.core.Tween;
  toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween;
  current: () => number;
  times: number[];
};

/**
 * Creates a seamless horizontal looping animation for any set of elements.
 * Each element slides left (or right) across the screen and wraps around.
 *
 * @param items - Elements to loop through horizontally
 * @param config - Optional configuration
 * @returns GSAP timeline with helpers (.next, .previous, .toIndex)
 */
export function horizontalLoop(
  items: Element[] | NodeListOf<Element>,
  config: HorizontalLoopConfig = {}
): LoopTimeline {
  const els = gsap.utils.toArray(items) as HTMLElement[];
  const tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100);
    },
  }) as LoopTimeline;

  const length = els.length;
  if (!length) return tl;

  const startX = els[0].offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const xPercents: number[] = [];
  let curIndex = 0;

  const pixelsPerSecond = (config.speed ?? 1) * 100;
  const snap =
    config.snap === false ? (v: number) => v : gsap.utils.snap((config.snap as number) || 1);

  // Measure and normalize widths
  gsap.set(els, {
    xPercent: (i, el) => {
      const w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px") as string) / w) * 100 +
          (gsap.getProperty(el, "xPercent") as number)
      );
      return xPercents[i];
    },
  });
  gsap.set(els, { x: 0 });

  // Compute total width
  const last = els[length - 1];
  const totalWidth =
    last.offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    last.offsetWidth * (gsap.getProperty(last, "scaleX") as number) +
    (config.paddingRight ?? 0);

  // Build looping timeline
  for (let i = 0; i < length; i++) {
    const item = els[i];
    const curX = (xPercents[i] / 100) * widths[i];
    const distanceToStart = item.offsetLeft + curX - startX;
    const distanceToLoop =
      distanceToStart + widths[i] * (gsap.getProperty(item, "scaleX") as number);

    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
        {
          xPercent: xPercents[i],
          duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add(`label${i}`, distanceToStart / pixelsPerSecond);

    times[i] = distanceToStart / pixelsPerSecond;
  }

  // --- Helpers ---
  function toIndex(index: number, vars: gsap.TweenVars = {}) {
    if (Math.abs(index - curIndex) > length / 2) index += index > curIndex ? -length : length;

    const newIndex = gsap.utils.wrap(0, length, index);
    let time = times[newIndex];

    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }

    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }

  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;

  tl.progress(1, true).progress(0, true);

  if (config.reversed) {
    tl.vars.onReverseComplete?.();
    tl.reverse();
  }

  return tl;
}
