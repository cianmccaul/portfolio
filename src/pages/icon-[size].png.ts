import type { APIRoute, GetStaticPaths } from 'astro';
import { iconPng } from '../lib/og';

export const getStaticPaths: GetStaticPaths = () => [192, 512].map((size) => ({ params: { size: String(size) } }));

export const GET: APIRoute = async ({ params }) =>
  new Response(new Uint8Array(await iconPng(Number(params.size))), { headers: { 'Content-Type': 'image/png' } });
