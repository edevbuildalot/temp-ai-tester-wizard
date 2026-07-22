import { readFile, writeFile, access } from "node:fs/promises";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), ".data");
const DATA_FILE = join(DATA_DIR, "signups.json");

async function ensureDataDir() {
  try {
    await access(DATA_DIR);
  } catch {
    await writeFile(DATA_DIR, "", { flag: "wx" }).catch(() => {});
  }
}

async function readSignups() {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeSignups(signups) {
  await ensureDataDir();
  await writeFile(DATA_FILE, JSON.stringify(signups, null, 2), "utf-8");
}

export async function GET() {
  const signups = await readSignups();
  return new Response(JSON.stringify({ count: signups.length }), {
    headers: { "content-type": "application/json" },
  });
}

export async function POST(request) {
  try {
    const { name, email } = await request.json();

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    const signups = await readSignups();

    if (signups.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
      return new Response(
        JSON.stringify({ error: "Already signed up", total_count: signups.length }),
        { status: 409, headers: { "content-type": "application/json" } }
      );
    }

    const entry = {
      id: crypto.randomUUID(),
      name: name || "",
      email: email.toLowerCase(),
      created_at: new Date().toISOString(),
    };

    signups.push(entry);
    await writeSignups(signups);

    return new Response(
      JSON.stringify({
        ok: true,
        id: entry.id,
        total_count: signups.length,
      }),
      {
        status: 201,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}