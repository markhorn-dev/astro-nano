import { expect, test, describe } from "vitest";
import { renderAstroComponent } from "./helpers";
import Login from "@components/Login.astro";

describe("Login", () => {
  test("Should render the Login component correctly", async () => {
    const result = await renderAstroComponent(Login);

    const link = result.querySelector("#link");
    const img = result.querySelector("#gh-logo");
    const resultText = result.textContent;

    expect(link).not.toBeNull();
    expect(link?.hasAttribute("href")).toBe(true);
    expect(img).not.toBeNull();
    expect(resultText).toContain("Sign in with GitHub");
    expect(resultText).toContain("Login");
  });
});
