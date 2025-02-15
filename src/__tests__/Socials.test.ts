import { expect, test, describe } from "vitest";
import { renderAstroComponent } from "./helpers";
import Socials from "@components/Socials.astro";
import { socialsData } from "@consts";

describe("Socials", () => {
  test("Should render the Socials component correctly", async () => {
    const result = await renderAstroComponent(Socials);

    const anchors = result.querySelectorAll("a");
    const imgs = result.querySelectorAll("img");
    const ghImg = imgs[0];
    const ghImgSrc = ghImg?.getAttribute("src");
    const ghElement = anchors[0];

    expect(anchors.length).toEqual(socialsData.length);
    expect(imgs.length).toEqual(socialsData.length);
    expect(ghElement?.hasAttribute("aria-label")).toBe(true);
    expect(ghImgSrc).not.toBeNull();
    expect(ghImgSrc).toContain("/icons/github.svg");
  });
});
