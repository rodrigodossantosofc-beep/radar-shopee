export async function GET() {
  return Response.json({
    ok: true,
    service: "radar-shopee",
    time: new Date().toISOString(),
  });
}
