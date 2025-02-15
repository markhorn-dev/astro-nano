import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ExternalLinkIcon } from "@components/ExternalLinkIcon";

describe("ExternalLinkIcon", () => {
  test("Should render the ExternalLinkIcon svg correctly", async () => {
    const { container } = render(<ExternalLinkIcon />);

    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute("width", "22");
    expect(svgElement).toHaveAttribute("height", "22");
    expect(svgElement).toHaveAttribute("viewBox", "0 0 24 24");
  });
});
