import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("*/movies", () => {
    return HttpResponse.json({
      items: [],
      pagination: { page: 1, total: 0, perPage: 10, totalPages: 0 },
    });
  }),
];
