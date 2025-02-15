import { expect, test, describe } from "vitest";
import { renderAstroComponent } from "./helpers";
import Avatar from "@components/Avatar.astro";

describe("Avatar", () => {
  test("Should render Avatar component correctly", async () => {
    const result = await renderAstroComponent(Avatar);

    const img = result.querySelector("img");
    const imgSrc = img?.getAttribute("src");
    const container = result.querySelector("#avatar-content");

    expect(container).not.toBeNull();
    expect(img).not.toBeNull();
    expect(img?.hasAttribute("src"));
    expect(imgSrc).toContain("/img/me.png");
  });
});
