import { expect, test, describe } from "vitest";
import { renderAstroComponent } from "./helpers";
import Details from "@components/Details.astro";

describe("Details", () => {
  test("Details component is rendered", async () => {
    const result = await renderAstroComponent(Details);

    const resultText = result.textContent;

    expect(resultText).toContain("Hi, I'm Rick");
    expect(resultText).toContain("Software Engineer");
    expect(resultText).toContain("Homelab enthusiast");
    expect(resultText).toContain("Washington D.C.");
  });
});
