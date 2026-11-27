import {
  createDOMRenderer,
  FluentProvider,
  RendererProvider,
} from "@fluentui/react-components";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Server-side rendering of Fluent UI v9 components with their Griffel CSS.
//
// Fluent components are rendered to static HTML on the server (no React in
// the browser). Griffel normally injects CSS at runtime; here each render gets
// its own renderer, and the rules it produced are returned so the caller can
// emit them as a <style> right before the markup: no flash of unstyled
// content, no client JS. Rules already emitted earlier in the same response
// are skipped.

// Griffel bucket order (lower buckets must come first for specificity).
const BUCKETS = [
  "r",
  "d",
  "l",
  "v",
  "w",
  "f",
  "i",
  "h",
  "a",
  "s",
  "k",
  "t",
  "m",
  "c",
];

export interface FluentRender {
  html: string;
  css: string;
}

export function renderFluent<P extends object>(
  component: ComponentType<P>,
  props: P,
  seen: Set<string>,
  idPrefix: string,
): FluentRender {
  const renderer = createDOMRenderer();
  // No theme object: the tokens are global CSS variables
  // (src/shared/styles/fluent-tokens.css), dark/light by media query.
  const tree = createElement(RendererProvider, {
    renderer,
    children: createElement(FluentProvider, {
      className: "fluent-root",
      applyStylesToPortals: false,
      children: createElement(component, props),
    }),
  });
  const html = renderToStaticMarkup(tree, { identifierPrefix: idPrefix });

  const byBucket = new Map<string, string[]>();
  for (const [rule, bucket] of Object.entries(renderer.insertionCache)) {
    if (seen.has(rule)) continue;
    seen.add(rule);
    const key = String(bucket);
    byBucket.set(key, [...(byBucket.get(key) ?? []), rule]);
  }
  const css = BUCKETS.flatMap((b) => byBucket.get(b) ?? []).join("");
  return { html, css };
}
