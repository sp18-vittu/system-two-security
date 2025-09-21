import moment from 'moment/moment'

export function friendlyTime(dateTime: any) {
  if (dateTime) {
    return moment(dateTime).fromNow()
  }

  return ''
}

/**
 * Sorts two values based on their date and time.
 * 
 * - Converts `v1` and `v2` into timestamps using `Date`.
 * - Handles invalid, null, or undefined values gracefully:
 *   - Invalid or null values are pushed to the end during sorting.
 * 
 * @param {string | Date | null | undefined} v1 - The first date value to compare. Can be a string, Date object, null, or undefined.
 * @param {string | Date | null | undefined} v2 - The second date value to compare. Can be a string, Date object, null, or undefined.
 * @returns {number} - A numeric value indicating the sort order:
 *   - `-1` if `v1` comes before `v2` chronologically.
 *   - `1` if `v1` comes after `v2` chronologically.
 *   - `0` if both values are equal or invalid.
 */
export const sortByDateTime = (v1: string | Date | null | undefined, v2: string | Date | null | undefined): number => {
  const date1 = v1 ? new Date(v1).getTime() : NaN; // Convert to timestamp, NaN if invalid
  const date2 = v2 ? new Date(v2).getTime() : NaN;

  if (isNaN(date1) && isNaN(date2)) return 0; // Both are invalid
  if (isNaN(date1)) return 1; // v1 is invalid, push it to the end
  if (isNaN(date2)) return -1; // v2 is invalid, push it to the end

  return date1 - date2; // Sort chronologically: earlier dates first
};


/**
 * Extracts padding and margin values (top/bottom) from an HTML element.
 * @param elementRef - The current ref of the target HTML element
 * @returns Object containing pt (padding-top), pb (padding-bottom), mt (margin-top), mb (margin-bottom)
 */
export function getElementSpacing(elementRef: HTMLElement | null) {
  if (!elementRef) return { pt: 0, pb: 0, mt: 0, mb: 0 };

  const computedStyles = window.getComputedStyle(elementRef);

  return {
    pt: parseFloat(computedStyles.paddingTop) || 0,
    pb: parseFloat(computedStyles.paddingBottom) || 0,
    mt: parseFloat(computedStyles.marginTop) || 0,
    mb: parseFloat(computedStyles.marginBottom) || 0,
  };
}

