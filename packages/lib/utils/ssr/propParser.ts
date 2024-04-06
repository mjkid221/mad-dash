/**
 * Parses props via a JSON.parse(JSON.stringify(props)) to remove any circular references
 * and returns the typed parsed props. This is often used in next server side props or static props
 */
export const propsParser = <T>(props: T): T =>
  JSON.parse(JSON.stringify(props)) as T;
