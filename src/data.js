import { stripHtml } from 'string-strip-html'

export async function randomContent() {
  const offset = Math.round(Math.random() * 9999);
  const response = await fetch(`https://cors.deno.dev/https://kohsantepheapdaily.com.kh/wp-json/wp/v2/posts?offset=${offset}&per_page=1&_fields=content`)
  const json = await response.json();
  const str = stripHtml(json[0].content.rendered).result;
  return str.replace(/\n/gm,'');
}