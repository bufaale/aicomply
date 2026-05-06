import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

/**
 * Vitest global setup. Runs before every test file.
 * - Brings in jest-dom matchers (toBeInTheDocument, toBeVisible, etc.)
 * - Mocks Next.js navigation hooks so atoms / components that call
 *   useRouter / usePathname can render in jsdom without real Next runtime.
 */

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

// next/link renders a real <a> in jsdom — no need to mock; the React
// component renders fine since it only checks for `href` + `children`.
