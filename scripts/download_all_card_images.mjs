import fs from 'fs';
import path from 'path';

const rootDir = path.resolve('..');
const publicCardsDir = path.resolve('../site/public/cards');
const cardsDir = path.resolve('../data/cards');

const cards = JSON.parse(fs.readFileSync(path.join(rootDir, 'dist/cards.json'), 'utf8'));
const ciDb = JSON.parse(fs.readFileSync('cardinsider_images_db.json', 'utf8'));
const bbDb = JSON.parse(fs.readFileSync('bankbazaar_images_db.json', 'utf8'));

// Verified official high-res card face image URLs
const verifiedUrls = {
  'amex-centurion': 'https://upload.wikimedia.org/wikipedia/commons/7/70/American_Express_Centurion_Card_front.jpg',
  'amex-platinum-charge': 'https://icm.aexp-static.com/Internet/internationalcardshop/en_in/images/cards/Platinum_Card.png',
  'amex-platinum-travel': 'https://icm.aexp-static.com/Internet/internationalcardshop/en_in/images/cards/Platinum_Travel_Card.png',
  'amex-platinum-reserve': 'https://icm.aexp-static.com/Internet/internationalcardshop/en_in/images/cards/Platinum_Reserve_Card.png',
  'amex-mrcc': 'https://icm.aexp-static.com/Internet/internationalcardshop/en_in/images/cards/Membership_Rewards_Card.png',
  'amex-gold': 'https://icm.aexp-static.com/Internet/internationalcardshop/en_in/images/cards/Gold_Card.png',
  'amex-smartearn': 'https://icm.aexp-static.com/Internet/internationalcardshop/en_in/images/cards/en_in-smart-earn-credit-card.png',
  'icici-amazon-pay': '/cards/icici/amazon-pay.webp',
  'kiwi-axis-kwk': 'https://cardinsider.com/wp-content/uploads/2026/05/PNB-Kiwi-Credit-Card-Launched.webp',
  'kiwi-yes-bank-virtual': 'https://cardinsider.com/wp-content/uploads/2026/05/PNB-Kiwi-Credit-Card-Launched.webp',
  'kiwi-pnb': 'https://cardinsider.com/wp-content/uploads/2026/05/PNB-Kiwi-Credit-Card-Launched.webp',
  'federal-scapia': 'https://cardinsider.com/wp-content/uploads/2023/11/Scapia-Credit-Card.webp',
  'bob-scapia': 'https://cardinsider.com/wp-content/uploads/2023/11/Scapia-Credit-Card.webp',
  'bob-onecard': 'https://cardinsider.com/wp-content/uploads/2024/05/OneCard-Credit-Card-Review.webp',
  'federal-onecard': 'https://cardinsider.com/wp-content/uploads/2024/05/OneCard-Credit-Card-Review.webp',
  'csb-onecard': 'https://cardinsider.com/wp-content/uploads/2024/05/OneCard-Credit-Card-Review.webp',
  'indian-bank-onecard': 'https://cardinsider.com/wp-content/uploads/2024/05/OneCard-Credit-Card-Review.webp',
  'south-indian-bank-onecard': 'https://cardinsider.com/wp-content/uploads/2024/05/OneCard-Credit-Card-Review.webp',
  'onecard-metal': 'https://cardinsider.com/wp-content/uploads/2024/05/OneCard-Credit-Card-Review.webp'
};

const issuerAliases = {
  'hdfc': ['hdfc-bank', 'hdfc'],
  'sbi': ['sbi-card', 'sbi'],
  'icici': ['icici-bank', 'icici'],
  'axis': ['axis-bank', 'axis'],
  'kotak': ['kotak-mahindra-bank', 'kotak'],
  'amex': ['american-express', 'amex'],
  'bob': ['bank-of-baroda', 'bobcard', 'bob'],
  'idfc-first': ['idfc-first-bank', 'idfc'],
  'indusind': ['indusind-bank', 'indusind'],
  'rbl': ['rbl-bank', 'rbl'],
  'au': ['au-bank', 'au-small-finance-bank', 'au'],
  'yes': ['yes-bank', 'yes'],
  'hsbc': ['hsbc-bank', 'hsbc'],
  'standard-chartered': ['standard-chartered', 'scb'],
  'federal': ['federal-bank', 'federal'],
  'bandhan': ['bandhan-bank', 'bandhan'],
  'dbs': ['dbs-bank', 'dbs'],
  'pnb': ['punjab-national-bank', 'pnb'],
  'boi': ['bank-of-india', 'boi'],
  'canara': ['canara-bank', 'canara'],
  'union': ['union-bank', 'union'],
  'idbi': ['idbi-bank', 'idbi'],
  'utkarsh': ['utkarsh-small-finance-bank', 'utkarsh'],
  'equitas': ['equitas-small-finance-bank', 'equitas'],
  'csb': ['csb-bank', 'csb'],
  'dcb': ['dcb-bank', 'dcb'],
  'jk-bank': ['jk-bank', 'jammu-and-kashmir-bank', 'jk'],
  'cbi': ['central-bank-of-india', 'cbi'],
  'scapia': ['scapia', 'federal-bank'],
  'onecard': ['onecard', 'bobcard', 'federal-bank', 'csb-bank', 'south-indian-bank', 'indian-bank'],
  'kiwi': ['kiwi', 'yes-bank', 'axis-bank', 'pnb'],
  'jupiter': ['jupiter', 'federal-bank', 'csb-bank'],
  'fi': ['fi', 'federal-bank']
};

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/credit\s*card/g, '')
    .replace(/bank/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function getTokens(str) {
  return new Set(normalize(str).split(' ').filter(w => w.length > 1 && !['card', 'the', 'and', 'for', 'ltd', 'bank', 'plus', 'pro'].includes(w)));
}

function findMatches(card) {
  if (verifiedUrls[card.id]) {
    return [verifiedUrls[card.id]];
  }

  const slug = card.id.replace(card.issuer + '-', '');
  const cardTokens = getTokens(card.name + ' ' + slug);
  const aliases = issuerAliases[card.issuer] || [card.issuer];

  const candidates = [];

  for (const entry of ciDb) {
    const title = entry.title || '';
    const url = (entry.url || entry.imgSrc).toLowerCase();

    let issuerMatch = false;
    for (const a of aliases) {
      if (url.includes(a) || title.toLowerCase().includes(a.replace('-', ' '))) {
        issuerMatch = true;
        break;
      }
    }
    if (url.includes('fintech-cards') || url.includes('business-cards')) issuerMatch = true;
    if (!issuerMatch) continue;

    const entryTokens = getTokens(title + ' ' + path.basename(entry.imgSrc, path.extname(entry.imgSrc)));
    
    let matches = 0;
    for (const t of cardTokens) {
      if (entryTokens.has(t)) matches++;
    }

    const score = matches / Math.max(cardTokens.size, 1);
    if (score >= 0.45) {
      candidates.push({ src: entry.imgSrc, score });
    }
  }

  for (const entry of bbDb) {
    const title = entry.title || '';
    const url = (entry.page || entry.imgSrc).toLowerCase();

    let issuerMatch = false;
    for (const a of aliases) {
      if (url.includes(a) || title.toLowerCase().includes(a.replace('-', ' '))) {
        issuerMatch = true;
        break;
      }
    }
    if (!issuerMatch) continue;

    const entryTokens = getTokens(title + ' ' + path.basename(entry.imgSrc, path.extname(entry.imgSrc)));
    
    let matches = 0;
    for (const t of cardTokens) {
      if (entryTokens.has(t)) matches++;
    }

    const score = matches / Math.max(cardTokens.size, 1);
    if (score >= 0.45) {
      candidates.push({ src: entry.imgSrc, score });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.map(c => c.src);
}

function updateYamlImagePath(issuer, slug, imagePath) {
  const yamlPath = path.join(cardsDir, issuer, `${slug}.yaml`);
  if (!fs.existsSync(yamlPath)) return;

  let raw = fs.readFileSync(yamlPath, 'utf8');
  if (raw.includes('image_path:')) {
    raw = raw.replace(/^image_path:.*$/m, `image_path: ${imagePath}`);
  } else {
    raw = raw.replace(/^(name:.*$)/m, `$1\nimage_path: ${imagePath}`);
  }
  fs.writeFileSync(yamlPath, raw, 'utf8');
}

async function runPipeline() {
  console.log(`Starting concurrent download pipeline for ${cards.length} cards...`);
  const concurrency = 12;
  let index = 0;
  let downloadedCount = 0;
  let alreadyExisted = 0;
  let missingCount = 0;

  async function worker() {
    while (index < cards.length) {
      const card = cards[index++];
      const slug = card.id.replace(card.issuer + '-', '');
      const issuer = card.issuer;
      const destDir = path.join(publicCardsDir, issuer);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

      // Check if image already exists on disk
      const possibleExtensions = ['.webp', '.png', '.jpg'];
      let existingFile = null;
      for (const ext of possibleExtensions) {
        const p = path.join(destDir, `${slug}${ext}`);
        if (fs.existsSync(p) && fs.statSync(p).size > 500) {
          existingFile = `/cards/${issuer}/${slug}${ext}`;
          break;
        }
      }

      if (existingFile) {
        alreadyExisted++;
        updateYamlImagePath(issuer, slug, existingFile);
        continue;
      }

      const candidateUrls = findMatches(card);
      if (candidateUrls.length === 0) {
        missingCount++;
        continue;
      }

      let downloaded = false;
      for (const url of candidateUrls) {
        if (url.startsWith('/cards/')) {
          updateYamlImagePath(issuer, slug, url);
          downloaded = true;
          break;
        }

        try {
          const res = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            signal: AbortSignal.timeout(6000)
          });

          if (!res.ok) continue;

          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.length < 500) continue;

          let ext = '.webp';
          if (url.includes('.png')) ext = '.png';
          else if (url.includes('.jpg') || url.includes('.jpeg')) ext = '.jpg';

          const destFileName = `${slug}${ext}`;
          const destFilePath = path.join(destDir, destFileName);
          const relativeImagePath = `/cards/${issuer}/${destFileName}`;

          fs.writeFileSync(destFilePath, buf);
          updateYamlImagePath(issuer, slug, relativeImagePath);
          downloadedCount++;
          downloaded = true;
          break;
        } catch (e) {
          // Try next candidate
        }
      }

      if (!downloaded) {
        missingCount++;
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  console.log(`\n========================================`);
  console.log(`PIPELINE SUMMARY:`);
  console.log(`Total Cards: ${cards.length}`);
  console.log(`Downloaded New: ${downloadedCount}`);
  console.log(`Already Present: ${alreadyExisted}`);
  console.log(`Total Cards with Card Face Images: ${downloadedCount + alreadyExisted} (${((downloadedCount + alreadyExisted) / cards.length * 100).toFixed(1)}%)`);
  console.log(`Without Candidate: ${missingCount}`);
  console.log(`========================================`);
}

runPipeline();
