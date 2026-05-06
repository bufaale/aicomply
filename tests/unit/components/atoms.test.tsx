/**
 * Unit: AIComply v2 atoms render correctly with prop variations.
 *
 * Covers: Mark, Icon, Brand, Pyramid, PyramidBar, TierBadge, AuthSide.
 * MktHeader/MktFooter/AppSidebar/AppMobileNav/AppTopbar are exercised in
 * the v2-port E2E suite where their active-link state matters.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Mark,
  Icon,
  Brand,
  Pyramid,
  PyramidBar,
  TierBadge,
  AuthSide,
} from "@/components/aicomply/atoms";

describe("Mark", () => {
  it("renders an svg with the default 24px size", () => {
    const { container } = render(<Mark />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
    expect(svg).toHaveAttribute("aria-hidden");
  });

  it("respects size prop", () => {
    const { container } = render(<Mark size={48} />);
    expect(container.querySelector("svg")).toHaveAttribute("width", "48");
  });

  it("uses currentColor by default and overrides via color prop", () => {
    const { container, rerender } = render(<Mark />);
    const stroke = container.querySelector("rect")?.getAttribute("stroke");
    expect(stroke).toBe("currentColor");
    rerender(<Mark color="#d4af37" />);
    const stroke2 = container.querySelector("rect")?.getAttribute("stroke");
    expect(stroke2).toBe("#d4af37");
  });
});

describe("Icon", () => {
  it("renders the svg for a known glyph name", () => {
    const { container } = render(<Icon name="check" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("treats the icon as decorative when no ariaLabel is passed", () => {
    const { container } = render(<Icon name="bell" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
  });

  it("exposes a labelled role when ariaLabel is set", () => {
    const { container } = render(<Icon name="bell" ariaLabel="Notifications" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Notifications");
    expect(svg).not.toHaveAttribute("aria-hidden");
  });

  it("uses default stroke=1.5 and respects override", () => {
    const { container, rerender } = render(<Icon name="check" />);
    expect(container.querySelector("svg")).toHaveAttribute("stroke-width", "1.5");
    rerender(<Icon name="check" stroke={2.4} />);
    expect(container.querySelector("svg")).toHaveAttribute("stroke-width", "2.4");
  });
});

describe("Brand", () => {
  it("renders Mark + AIComply wordmark inside an anchor", () => {
    render(<Brand />);
    const link = screen.getByRole("link", { name: /AIComply/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/v2");
  });

  it("uses custom href when supplied", () => {
    render(<Brand href="/dashboard" />);
    expect(screen.getByRole("link", { name: /AIComply/i })).toHaveAttribute(
      "href",
      "/dashboard",
    );
  });
});

describe("Pyramid", () => {
  it("renders all 4 risk-tier rows in correct order", () => {
    render(<Pyramid />);
    const rows = screen.getAllByText(/Prohibited|High-risk|Limited risk|Minimal risk/);
    expect(rows.length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText("Prohibited")).toBeInTheDocument();
    expect(screen.getByText("High-risk")).toBeInTheDocument();
    expect(screen.getByText("Limited risk")).toBeInTheDocument();
    expect(screen.getByText("Minimal risk")).toBeInTheDocument();
  });

  it("default shows obligation text when no counts override is passed", () => {
    render(<Pyramid />);
    expect(screen.getByText(/Cease use/)).toBeInTheDocument();
    expect(screen.getByText(/Conformity assessment/)).toBeInTheDocument();
    expect(screen.getByText(/Disclose to users/)).toBeInTheDocument();
    // The Minimal tier obligation is "None"
    expect(screen.getAllByText(/None/).length).toBeGreaterThan(0);
  });

  it("overrides obligation cells when counts prop is provided", () => {
    render(
      <Pyramid
        counts={{
          prohibited: "BANNED",
          high: "ASSESS",
          limited: "DISCLOSE",
          minimal: "VOLUNTARY",
        }}
      />,
    );
    expect(screen.getByText("BANNED")).toBeInTheDocument();
    expect(screen.getByText("ASSESS")).toBeInTheDocument();
    expect(screen.getByText("DISCLOSE")).toBeInTheDocument();
    expect(screen.getByText("VOLUNTARY")).toBeInTheDocument();
    // Default obligations should be replaced
    expect(screen.queryByText(/Cease use/)).not.toBeInTheDocument();
  });

  it("applies dark variant class when dark prop is set", () => {
    const { container } = render(<Pyramid dark />);
    expect(container.querySelector(".aic-pyramid--dark")).toBeInTheDocument();
  });

  it("applies hide-mobile class when hideOnMobile is true", () => {
    const { container } = render(<Pyramid hideOnMobile />);
    expect(container.querySelector(".aic-hide-mobile")).toBeInTheDocument();
  });
});

describe("PyramidBar", () => {
  it("renders 4 segments + 4 labels", () => {
    const { container } = render(<PyramidBar />);
    const segs = container.querySelectorAll(".seg");
    expect(segs).toHaveLength(4);
    // Labels grid below the bar
    expect(screen.getByText("Prohibited")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Limited")).toBeInTheDocument();
    expect(screen.getByText("Minimal")).toBeInTheDocument();
  });

  it("dims non-current segments when current is set", () => {
    const { container } = render(<PyramidBar current="high" />);
    const segs = container.querySelectorAll<HTMLElement>(".seg");
    // The high segment should have opacity ~0.95 (current); others ~0.25
    const highSeg = container.querySelector('.seg[data-tier="high"]');
    const otherSeg = container.querySelector('.seg[data-tier="prohibited"]');
    expect(highSeg).toHaveStyle({ opacity: "0.95" });
    expect(otherSeg).toHaveStyle({ opacity: "0.25" });
    expect(segs.length).toBe(4);
  });
});

describe("TierBadge", () => {
  it("renders label matching tier when no override", () => {
    render(<TierBadge tier="high" />);
    expect(screen.getByText("High-risk")).toBeInTheDocument();
  });

  it("uses override label when provided", () => {
    render(<TierBadge tier="high" label="HIGH" />);
    expect(screen.getByText("HIGH")).toBeInTheDocument();
    expect(screen.queryByText("High-risk")).not.toBeInTheDocument();
  });

  it("emits dark variant class when dark is set", () => {
    const { container } = render(<TierBadge tier="prohibited" dark />);
    expect(container.querySelector(".aic-tier-badge--dark")).toBeInTheDocument();
  });

  it("encodes the tier as data-tier for CSS color targeting", () => {
    const { container } = render(<TierBadge tier="limited" />);
    expect(container.querySelector('[data-tier="limited"]')).toBeInTheDocument();
  });
});

describe("AuthSide", () => {
  it("renders default headline + description + regulation footer", () => {
    render(<AuthSide />);
    // Default headline includes "register" with the gold italic span
    expect(screen.getByText(/auditor reads in 30 seconds/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Inventory every AI system, auto-classify the four risk tiers/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/REGULATION \(EU\) 2024\/1689 · CHAPTER I · ARTICLE 99/i),
    ).toBeInTheDocument();
  });

  it("accepts custom headline + description overrides", () => {
    render(
      <AuthSide
        headline="Custom heading"
        description="Custom description text."
      />,
    );
    expect(screen.getByText("Custom heading")).toBeInTheDocument();
    expect(screen.getByText("Custom description text.")).toBeInTheDocument();
    // Defaults should NOT appear
    expect(screen.queryByText(/auditor reads in 30 seconds/i)).not.toBeInTheDocument();
  });
});
