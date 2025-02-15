import { expect, test, describe } from "vitest";
import { renderAstroComponent } from "./helpers";
import BackToTop from "@components/BackToTop.astro";

describe("BackToTop", () => {
  test("Should render BackToTop component correctly", async () => {
    const result = await renderAstroComponent(BackToTop);
    const resultText = result.textContent;

    const btn = result.querySelector("button");
    const svg = result.querySelector("#back-to-top-svg");

    expect(resultText).toContain("Back to top");
    expect(btn).not.toBeNull();
    expect(svg).not.toBeNull();
  });
});
