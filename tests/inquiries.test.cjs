const assert = require("node:assert/strict");
const {test} = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

function loadTypeScript(relative) {
  const filename = path.resolve(__dirname, "..", relative);
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
  });
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const normalRequire = loaded.require.bind(loaded);
  loaded.require = (name) => name === "@/lib/schemas" ? loadTypeScript("lib/schemas.ts") : normalRequire(name);
  loaded._compile(compiled.outputText, filename);
  return loaded.exports;
}

const inquiry = {
  mode: "online", studentName: "Test Student", grade: 8, board: "CBSE",
  subjects: ["Mathematics"], goals: ["Revision"], city: "Test City",
  frequency: "Weekly", preferredTime: "Evening", parentName: "Test Parent",
  whatsapp: "0000000000", phone: "0000000000", email: "test@example.com",
  currentScore: "70", targetScore: "80",
};
function request(body = inquiry) {
  return new Request("http://localhost/api/inquiries", {
    method: "POST", body: JSON.stringify(body), headers: {"Content-Type": "application/json"},
  });
}

test("inquiries persist with schema-compatible keys and unique references", async (t) => {
  process.env.SUPABASE_URL = "https://storage.example.invalid";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-key";
  delete process.env.RESEND_API_KEY;
  const saved = [];
  t.mock.method(Date, "now", () => 1700000000000);
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    const row = JSON.parse(options.body);
    assert.ok(row.studentname);
    assert.ok(row.parentname);
    assert.equal(row.preferredtime, "Evening");
    assert.equal(row.currentscore, "70");
    assert.equal(row.targetscore, "80");
    for (const key of ["studentName", "parentName", "preferredTime", "currentScore", "targetScore"]) {
      assert.equal(key in row, false);
    }
    assert.ok(!saved.some((existing) => existing.reference === row.reference));
    saved.push(row);
    return new Response(null, {status: 201});
  });
  const {POST} = loadTypeScript("app/api/inquiries/route.ts");
  const replies = await Promise.all([POST(request()), POST(request())]);
  for (const reply of replies) {
    assert.equal(reply.status, 200);
    assert.equal((await reply.json()).success, true);
  }
  assert.equal(saved.length, 2);
});

test("invalid input never reaches storage", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {throw new Error("Storage must not run");});
  const {POST} = loadTypeScript("app/api/inquiries/route.ts");
  assert.equal((await POST(request({}))).status, 400);
});

test("failed storage cannot produce a success response", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response(null, {status: 503}));
  t.mock.method(console, "error", () => {});
  const {POST} = loadTypeScript("app/api/inquiries/route.ts");
  const reply = await POST(request());
  assert.equal(reply.status, 500);
  assert.equal((await reply.json()).success, false);
});
