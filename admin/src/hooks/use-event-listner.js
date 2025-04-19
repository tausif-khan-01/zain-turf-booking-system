/**
 * A custom hook that allows you to add an event listener to an element.
 * @module useEventListener
 * @category Hooks
 * @subcategory useEventListener
 * @param {string} eventType - The event type to listen for.
 * @param {function} callback - The callback function to run when the event occurs.
 * @param {object} element - The element to attach the event listener to.
 * @returns {undefined}
 * @example
 *  import { useState } from "react"
 *   import useEventListener from "./useEventListener"
 *
 *    export default function EventListenerComponent() {
 *      const [key, setKey] = useState("")
 *      useEventListener("keydown", e => {
 *        setKey(e.key)
 *      })
 *
 *      return <div>Last Key: {key}</div>
 *    }
 *
 */

import { useEffect, useRef } from "react";

export default function useEventListener(
  eventType,
  callback,
  element = window
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (element == null) return;
    const handler = (e) => callbackRef.current(e);
    element.addEventListener(eventType, handler);

    return () => element.removeEventListener(eventType, handler);
  }, [eventType, element]);
}
