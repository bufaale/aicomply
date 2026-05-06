/**
 * Marketing landing — promoted from /v2 to / on the v2 swap. Renders the
 * same content as /v2 (single source of truth lives in src/app/v2/page).
 * The marketing layout owns chrome (MktHeader/MktFooter), so re-exporting
 * the v2 default avoids double headers.
 */
export { default } from "../v2/page";
