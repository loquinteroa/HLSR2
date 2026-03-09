/**
 * Firebase Auth Bulk Import Script
 *
 * Uses `firebase auth:import` (no service account required — uses Firebase CLI auth).
 * Reads roster2026-leadership-with-password.csv and imports each person into
 * Firebase Authentication with role "Leadership".
 *
 * Run from the functions directory:
 *   node scripts/importUsers.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ── CSV Parser ─────────────────────────────────────────────────────────────
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes;
    } else if (line[i] === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += line[i];
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(content) {
  const lines = content.trim().split('\n').filter(l => l.trim());
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h.trim()] = values[i] || ''; });
    return obj;
  }).filter(row => row['Primary Email']);
}

// ── Main ───────────────────────────────────────────────────────────────────
function main() {
  const csvPath = path.join(__dirname, '../../roster2026-leadership-with-password.csv');
  const importPath = path.join(__dirname, 'users-import.json');
  const projectRoot = path.join(__dirname, '../..');

  if (!fs.existsSync(csvPath)) {
    console.error(`\nERROR: CSV file not found at:\n  ${csvPath}\n`);
    process.exit(1);
  }

  const rows = parseCSV(fs.readFileSync(csvPath, 'utf8'));
  console.log(`\nFound ${rows.length} users in CSV...\n`);

  // Generate a random HMAC key (Firebase will use this to verify future logins)
  const hmacKey = crypto.randomBytes(32);
  const hmacKeyBase64 = hmacKey.toString('base64');

  const firebaseUsers = [];
  const skipped = [];

  for (const row of rows) {
    const email       = row['Primary Email'];
    const displayName = row['Full Name'];
    const password    = row['Password'];

    if (!email || !password || !displayName) {
      skipped.push(row);
      continue;
    }

    // HMAC-SHA256 hash: hash = HMAC_SHA256(password, hmacKey)
    // With empty salt, Firebase verifies as HMAC(key, salt + password) = HMAC(key, password)
    const passwordHash = crypto
      .createHmac('sha256', hmacKey)
      .update(password)
      .digest('base64');

    firebaseUsers.push({
      localId: crypto.randomBytes(14).toString('hex'),
      email,
      displayName,
      passwordHash,
      customAttributes: JSON.stringify({ role: 'Leadership' }),
    });
  }

  if (skipped.length > 0) {
    console.log(`Skipping ${skipped.length} rows with missing data.`);
  }

  // Write the import JSON file
  fs.writeFileSync(importPath, JSON.stringify({ users: firebaseUsers }, null, 2));
  console.log(`Prepared ${firebaseUsers.length} users for import.`);
  console.log('Running firebase auth:import...\n');

  try {
    const result = execSync(
      [
        'firebase auth:import',
        `"${importPath}"`,
        '--hash-algo HMAC_SHA256',
        `--hash-key "${hmacKeyBase64}"`,
        '--project hlsr-shift-manager-24ebd',
      ].join(' '),
      { cwd: projectRoot, encoding: 'utf8', stdio: ['pipe', 'pipe', 'inherit'] }
    );
    console.log(result);
    console.log('✓ Import complete!');
  } catch (err) {
    const msg = err.stderr || err.stdout || err.message;
    console.error('Import failed:\n', msg);
    process.exit(1);
  } finally {
    // Remove the temporary file (it contains hashed passwords)
    if (fs.existsSync(importPath)) {
      fs.unlinkSync(importPath);
    }
  }
}

main();
