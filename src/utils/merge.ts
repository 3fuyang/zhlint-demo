/**
 * Trim and merge classnames to a single string.
 * @param classNames Names of classes which are attached to an element.
 */
export function merge(classNames: string[]) {
  return classNames.filter((n) => n).join(' ')
}
