/**
 * SIT725 – 5.4D Validation Tests (MANDATORY TEMPLATE)
 *
 * HOW TO RUN: (Node.js 18+ is required)
 *   1. Start MongoDB
 *   2. Start your server (npm start)
 *   3. node validation-tests.js
 *
 * DO NOT MODIFY:
 *   - Output format (TEST|, SUMMARY|, COVERAGE|)
 *   - test() function signature
 *   - Exit behaviour
 *   - coverageTracker object
 *   - Logging structure
 *
 * YOU MUST:
 *   - Modify makeValidBook() to satisfy your schema rules
 *   - Add sufficient tests to meet coverage requirements
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE = "/api/books";

// =============================
// INTERNAL STATE (DO NOT MODIFY)
// =============================

const results = [];

const coverageTracker = {
  CREATE_FAIL: 0,
  UPDATE_FAIL: 0,
  TYPE: 0,
  REQUIRED: 0,
  BOUNDARY: 0,
  LENGTH: 0,
  TEMPORAL: 0,
  UNKNOWN_CREATE: 0,
  UNKNOWN_UPDATE: 0,
  IMMUTABLE: 0,
};

// =============================
// OUTPUTS FORMAT (DO NOT MODIFY)
// =============================

function logHeader(uniqueId) {
  console.log("SIT725_VALIDATION_TESTS");
  console.log(`BASE_URL=${BASE_URL}`);
  console.log(`API_BASE=${API_BASE}`);
  console.log(`INFO|Generated uniqueId=${uniqueId}`);
}

function logResult(r) {
  console.log(
    `TEST|${r.id}|${r.name}|${r.method}|${r.path}|expected=${r.expected}|actual=${r.actual}|pass=${r.pass ? "Y" : "N"}`
  );
}

function logSummary() {
  const failed = results.filter(r => !r.pass).length;
  console.log(
    `SUMMARY|pass=${failed === 0 ? "Y" : "N"}|failed=${failed}|total=${results.length}`
  );
  return failed === 0;
}

function logCoverage() {
  console.log(
    `COVERAGE|CREATE_FAIL=${coverageTracker.CREATE_FAIL}` +
    `|UPDATE_FAIL=${coverageTracker.UPDATE_FAIL}` +
    `|TYPE=${coverageTracker.TYPE}` +
    `|REQUIRED=${coverageTracker.REQUIRED}` +
    `|BOUNDARY=${coverageTracker.BOUNDARY}` +
    `|LENGTH=${coverageTracker.LENGTH}` +
    `|TEMPORAL=${coverageTracker.TEMPORAL}` +
    `|UNKNOWN_CREATE=${coverageTracker.UNKNOWN_CREATE}` +
    `|UNKNOWN_UPDATE=${coverageTracker.UNKNOWN_UPDATE}` +
    `|IMMUTABLE=${coverageTracker.IMMUTABLE}`
  );
}

// =============================
// HTTP HELPER
// =============================

async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  return { status: res.status, text };
}

// =============================
// TEST REGISTRATION FUNCTION
// =============================

async function test({ id, name, method, path, expected, body, tags }) {

  const { status } = await http(method, path, body);
  const pass = status === expected;

  const result = { id, name, method, path, expected, actual: status, pass };
  results.push(result);
  logResult(result);

  // treat missing or invalid tags as []
  const safeTags = Array.isArray(tags) ? tags : [];

  safeTags.forEach(tag => {
    if (Object.prototype.hasOwnProperty.call(coverageTracker, tag)) {
      coverageTracker[tag]++;
    }
  });
}

// =============================
// STUDENT MUST MODIFY THESE
// =============================

function makeValidBook(id) {
  return {
    id,
    title: "Valid Title",
    author: "Valid Author",
    year: 2020,
    genre: "Fiction",
    summary: "Valid summary.",
    price: "9.99",
    currency: "AUD"
  };
}

function makeValidUpdate() {
  return {
    title: "Updated Title",
    author: "Updated Author",
    year: 2021,
    genre: "Drama",
    summary: "Updated summary.",
    price: "10.50",
    currency: "AUD"
  };
}

// =============================
// REQUIRED BASE TESTS (DO NOT REMOVE)
// =============================

async function run() {

  const uniqueId = `b${Date.now()}`;
  logHeader(uniqueId);

  const createPath = API_BASE;
  const updatePath = (id) => `${API_BASE}/${id}`;

  // ---- T01 Valid CREATE ----
  await test({
    id: "T01",
    name: "Valid create",
    method: "POST",
    path: createPath,
    expected: 201,
    body: makeValidBook(uniqueId),
    tags: []
  });

  // ---- T02 Duplicate ID ----
  await test({
    id: "T02",
    name: "Duplicate ID",
    method: "POST",
    path: createPath,
    expected: 409,
    body: makeValidBook(uniqueId),
    tags: ["CREATE_FAIL"]
  });

  // ---- T03 Immutable ID ----
  await test({
    id: "T03",
    name: "Immutable ID on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), id: "b999" },
    tags: ["UPDATE_FAIL", "IMMUTABLE"]
  });

  // ---- T04 Unknown field CREATE ----
  await test({
    id: "T04",
    name: "Unknown field CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+1}`), hack: true },
    tags: ["CREATE_FAIL", "UNKNOWN_CREATE"]
  });

  // ---- T05 Unknown field UPDATE ----
  await test({
    id: "T05",
    name: "Unknown field UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), hack: true },
    tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"]
  });

  // =====================================
  // STUDENTS MUST ADD ADDITIONAL TESTS
  // =====================================
  //
  // Add tests covering:
  // - REQUIRED
  // - TYPE
  // - BOUNDARY
  // - LENGTH
  // - TEMPORAL
  // - UPDATE_FAIL
  //
  // Each test must include appropriate tags.
  //
  // ---- T06 Missing required title on CREATE ----
  const missingTitle = makeValidBook(`b${Date.now()+2}`);
  delete missingTitle.title;
  await test({
    id: "T06",
    name: "Missing required title on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: missingTitle,
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T07 Wrong type for year on CREATE ----
  await test({
    id: "T07",
    name: "Wrong type year on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+3}`), year: "not-a-number" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- T08 Negative year on CREATE ----
  await test({
    id: "T08",
    name: "Negative year on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+4}`), year: -1 },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  // ---- T09 Future year too large on CREATE ----
  await test({
    id: "T09",
    name: "Future year too large on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+5}`), year: 99999 },
    tags: ["CREATE_FAIL", "TEMPORAL"]
  });

  // ---- T10 Empty summary on CREATE ----
  await test({
    id: "T10",
    name: "Empty summary on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+6}`), summary: "" },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T11 Zero price on CREATE ----
  await test({
    id: "T11",
    name: "Zero price on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+7}`), price: "0" },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  // ---- T12 Wrong currency on CREATE ----
  await test({
    id: "T12",
    name: "Wrong currency on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+8}`), currency: "USD" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- T13 Valid UPDATE ----
  await test({
    id: "T13",
    name: "Valid update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 200,
    body: makeValidUpdate(),
    tags: []
  });

  // ---- T14 Update non-existing book ----
  await test({
    id: "T14",
    name: "Update non-existing book",
    method: "PUT",
    path: updatePath("b-does-not-exist"),
    expected: 404,
    body: makeValidUpdate(),
    tags: ["UPDATE_FAIL"]
  });

  // ---- T15 Wrong type year on UPDATE ----
  await test({
    id: "T15",
    name: "Wrong type year on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), year: "future" },
    tags: ["UPDATE_FAIL", "TYPE"]
  });

  // ---- T16 Empty genre on UPDATE ----
  await test({
    id: "T16",
    name: "Empty genre on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), genre: "" },
    tags: ["UPDATE_FAIL", "LENGTH"]
  });

  // ---- T17 Negative price on UPDATE ----
  await test({
    id: "T17",
    name: "Negative price on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), price: "-4.00" },
    tags: ["UPDATE_FAIL", "BOUNDARY"]
  });

  // ---- T18 Future year too large on UPDATE ----
  await test({
    id: "T18",
    name: "Future year too large on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), year: 99999 },
    tags: ["UPDATE_FAIL", "TEMPORAL"]
  });

  // ---- T19 Missing required author on UPDATE ----
  const missingAuthorUpdate = makeValidUpdate();
  delete missingAuthorUpdate.author;
  await test({
  id: "T19",
  name: "Empty author on update",
  method: "PUT",
  path: updatePath(uniqueId),
  expected: 400,
  body: { ...makeValidUpdate(), author: "" },
  tags: ["UPDATE_FAIL", "REQUIRED"]
});


  // LOG SUMMARY

  const pass = logSummary();
  logCoverage();

  process.exit(pass ? 0 : 1);
}

run().catch(err => {
  console.error("ERROR", err);
  process.exit(2);
});