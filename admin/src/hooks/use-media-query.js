/**
 * useMediaQuery Hook
 * @param {string} mediaQuery
 * @returns {boolean} Whether the media query matches or not.
 * @example
 *import useMediaQuery from "./useMediaQuery"
 *
 *export default function MediaQueryComponent() {
 *  const isLarge = useMediaQuery("(min-width: 200px)")
 *
 *  return <div>Large: {isLarge.toString()}</div>
 *}

 */

import { useState, useEffect } from "react";
import useEventListener from "./use-event-listner";

export default function useMediaQuery(mediaQuery) {
  const [isMatch, setIsMatch] = useState(false);
  const [mediaQueryList, setMediaQueryList] = useState(null);

  useEffect(() => {
    const list = window.matchMedia(mediaQuery);
    setMediaQueryList(list);
    setIsMatch(list.matches);
  }, [mediaQuery]);

  useEventListener("change", (e) => setIsMatch(e.matches), mediaQueryList);

  return isMatch;
}
