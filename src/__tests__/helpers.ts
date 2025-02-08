import {
  experimental_AstroContainer as AstroContainer,
  type ContainerRenderOptions,
} from "astro/container";
type AstroComponentFactory = Parameters<AstroContainer["renderToString"]>[0];

export async function renderAstroComponent(
  Component: AstroComponentFactory,
  options: ContainerRenderOptions = {},
) {
  const container = await AstroContainer.create();
  const result = await container.renderToString(Component, options);

  const template = document.createElement("template");
  template.innerHTML = result;
  return template.content;
}
