import { GET as getLlmsTxt } from '../../llms.txt/route';

export const dynamic = 'force-static';

export async function GET() {
  return getLlmsTxt();
}
