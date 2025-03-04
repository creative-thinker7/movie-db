import "@testing-library/jest-dom";

global.Response = class {
  constructor(
    public body: string,
    public init: { status: number; headers?: HeadersInit },
  ) {}

  get status() {
    return this.init?.status || 200;
  }

  get headers() {
    return new Headers(this.init.headers);
  }

  json() {
    return Promise.resolve(JSON.parse(this.body));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static json(data: any, init?: { status: number; headers?: HeadersInit }) {
    return new Response(JSON.stringify(data), init);
  }
} as unknown as typeof Response;
