import { createSlug, parsePositiveNumber } from "./";

describe("createSlug()", () => {
  it("should convert a basic string to a slug", () => {
    expect(createSlug("Hello World")).toBe("hello-world");
  });

  it("should remove special characters", () => {
    expect(createSlug("Hello, World!")).toBe("hello-world");
  });

  it("should normalize accented characters", () => {
    expect(createSlug("Café au Lait")).toBe("cafe-au-lait");
  });

  it("should replace multiple spaces with a single hyphen", () => {
    expect(createSlug("Hello   World")).toBe("hello-world");
  });

  it("should trim leading and trailing spaces", () => {
    expect(createSlug("  Hello World  ")).toBe("hello-world");
  });

  it("should replace multiple hyphens with a single hyphen", () => {
    expect(createSlug("Hello--World")).toBe("hello-world");
  });
});

describe("parsePositiveNumber()", () => {
  const defaultValue = 10;

  it("should return the parsed number for a valid positive number", () => {
    expect(parsePositiveNumber("42", defaultValue)).toBe(42);
  });

  it("should return the default value for null", () => {
    expect(parsePositiveNumber(null, defaultValue)).toBe(defaultValue);
  });

  it("should return the default value for an invalid string", () => {
    expect(parsePositiveNumber("abc", defaultValue)).toBe(defaultValue);
  });

  it("should return the default value for a negative number", () => {
    expect(parsePositiveNumber("-10", defaultValue)).toBe(defaultValue);
  });

  it("should return the default value for zero", () => {
    expect(parsePositiveNumber("0", defaultValue)).toBe(defaultValue);
  });

  it("should return the default value for an empty string", () => {
    expect(parsePositiveNumber("", defaultValue)).toBe(defaultValue);
  });
});
