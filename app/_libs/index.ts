interface CallApiProps {
  url: string;
  method?: "GET" | "POST";
  body?: unknown;
}

export async function callApi({ url, method = "GET", body }: CallApiProps) {
  return fetch(`/api${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
}

interface CallApiWithFormDataProps {
  url: string;
  method?: "POST" | "PATCH";
  body: FormData;
}

export async function callApiWithFormData({
  url,
  method = "POST",
  body,
}: CallApiWithFormDataProps) {
  return fetch(`/api${url}`, {
    method,
    credentials: "include",
    body,
  });
}

export function generateResponse(message: string, status: number) {
  return new Response(
    JSON.stringify({
      message,
    }),
    {
      status,
    },
  );
}

export function createSlug(title: string) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function parsePositiveNumber(
  value: string | null,
  defaultValue: number,
) {
  const number = Number(value);
  if (value === null || isNaN(number) || number <= 0) {
    return defaultValue;
  }
  return number;
}
