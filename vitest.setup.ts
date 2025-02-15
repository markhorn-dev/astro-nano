import "@testing-library/jest-dom";
import { TextEncoder } from "util";
import { TextDecoder } from "node:util";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
global.document = dom.window.document;
global.navigator = dom.window.navigator;
(global as any).window = dom.window;
global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
global.Element = dom.window.Element;
