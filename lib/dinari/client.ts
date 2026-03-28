const DINARI_BASE_URL = "https://api-enterprise.sandbox.dinari.com/api/v2";

export interface DinariStock {
  id: string;
  name: string;
  symbol: string;
  is_fractionable: boolean;
  is_tradable: boolean;
  tokens: string[];
  composite_figi: string | null;
  cusip: string | null;
  cik: string | null;
  display_name: string | null;
  description: string | null;
  logo_url: string | null;
}

function getHeaders(): Record<string, string> {
  const keyId = process.env.DINARI_API_KEY_ID;
  const secret = process.env.DINARI_API_SECRET_KEY;

  if (!keyId || !secret) {
    throw new Error("Dinari API credentials not configured");
  }

  return {
    "X-API-Key-Id": keyId,
    "X-API-Secret-Key": secret,
    "Content-Type": "application/json",
  };
}

export function isDinariConfigured(): boolean {
  return Boolean(
    process.env.DINARI_API_KEY_ID && process.env.DINARI_API_SECRET_KEY
  );
}

export async function getStocks(symbols?: string[]): Promise<DinariStock[]> {
  const url = new URL(`${DINARI_BASE_URL}/market_data/stocks/`);

  if (symbols?.length) {
    for (const s of symbols) {
      url.searchParams.append("symbols", s);
    }
  }
  url.searchParams.set("page_size", "100");

  const res = await fetch(url.toString(), { headers: getHeaders() });

  if (!res.ok) {
    throw new Error(`Dinari API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<DinariStock[]>;
}
