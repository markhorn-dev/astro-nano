import { expect, test, describe } from "vitest";
import { renderAstroComponent } from "./helpers";
import Header from "@components/Header.astro";

describe("Header", () => {
  test("Default Header component is rendered", async () => {
    const locals: App.Locals = {
      user: null,
      session: null,
    };

    const result = await renderAstroComponent(Header, { locals });

    const resultText = result.textContent;

    expect(resultText).toContain("home");
    expect(resultText).toContain("blog");
    expect(resultText).toContain("work");
    expect(resultText).toContain("projects");
    expect(resultText).toContain("/");
    expect(resultText).not.toContain("admin");
    expect(resultText).not.toContain("gifts");
    expect(resultText).not.toContain("upload");
    expect(resultText).not.toContain("logout");
  });
  test("Admin Header component is rendered when isAdmin is set to true", async () => {
    const locals: App.Locals = {
      user: { id: 1, name: "Admin" },
      session: true,
    };

    const result = await renderAstroComponent(Header, { locals });

    const resultText = result.textContent;

    expect(resultText).toContain("home");
    expect(resultText).toContain("blog");
    expect(resultText).toContain("work");
    expect(resultText).toContain("projects");
    expect(resultText).toContain("admin");
    expect(resultText).toContain("gifts");
    expect(resultText).toContain("upload");
    expect(resultText).toContain("logout");
    expect(resultText).toContain("/");
  });
});
