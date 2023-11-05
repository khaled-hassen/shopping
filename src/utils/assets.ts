export function asset(path: string | undefined) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  return `${apiUrl}/${path}`;
}
