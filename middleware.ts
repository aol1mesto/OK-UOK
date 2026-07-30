export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/audits/:path*",
    "/reports/:path*",
    "/employees/:path*",
  ],
};
