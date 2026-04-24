import { GET as getLlmsFullTxt } from '../../llms-full.txt/route';

export const dynamic = 'force-static';

export async function GET() {
  return getLlmsFullTxt();
}
