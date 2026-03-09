/**
 * Bulk User Registration Script
 *
 * Reads roster2026-leadership-with-password.csv and registers each person
 * in Firebase Authentication, then sets their role to "Leadership".
 *
 * Prerequisites:
 *   1. Download a service account key from Firebase Console:
 *      Project Settings → Service Accounts → Generate new private key
 *      Save it as:  functions/scripts/serviceAccount.json
 *   2. Run from the functions directory:
 *      node scripts/bulkRegister.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// ── Credentials ────────────────────────────────────────────────────────────
const serviceAccountPath = path.join(__dirname, 'serviceAccount.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('\nERROR: serviceAccount.json not found.');
  console.error('Download it from Firebase Console → Project Settings → Service Accounts → Generate new private key');
  console.error(`Save it to: ${serviceAccountPath}\n`);
  process.exit(1);
}

const serviceAccount = require('./serviceAccount.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

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
async function main() {
  const csvPath = path.join(__dirname, '../../roster2026-leadership-with-password.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`\nERROR: CSV file not found at:\n  ${csvPath}\n`);
    process.exit(1);
  }

  const users = parseCSV(fs.readFileSync(csvPath, 'utf8'));
  console.log(`\nFound ${users.length} users to process...\n`);

  let created = 0, skipped = 0, failed = 0;

  for (const user of users) {
    const email       = user['Primary Email'];
    const displayName = user['Full Name'];
    const password    = user['Password'];

    if (!email || !password || !displayName) {
      console.log(`  SKIP  — missing data for row: ${JSON.stringify(user)}`);
      skipped++;
      continue;
    }

    try {
      // Create the Firebase Auth account
      const record = await admin.auth().createUser({ email, password, displayName });

      // Assign Leadership role
      await admin.auth().setCustomUserClaims(record.uid, { role: 'Leadership' });

      console.log(`  ✓  ${displayName.padEnd(30)} ${email}`);
      created++;
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        console.log(`  —  ALREADY EXISTS: ${displayName.padEnd(25)} ${email}`);
        skipped++;
      } else {
        console.log(`  ✗  FAILED: ${displayName} (${email}) — ${err.message}`);
        failed++;
      }
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`  Created : ${created}`);
  console.log(`  Skipped : ${skipped}  (already existed)`);
  console.log(`  Failed  : ${failed}`);
  console.log(`─────────────────────────────────────────\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => { console.error(err); process.exit(1); });
