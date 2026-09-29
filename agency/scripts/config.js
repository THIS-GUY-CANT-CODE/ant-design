// Shared agency settings from agency.json (email, domain, prices). SITE_URL env var overrides siteUrl.
const fs = require('fs');
const path = require('path');
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'agency.json'), 'utf8'));
if (process.env.SITE_URL) cfg.siteUrl = process.env.SITE_URL;
const gbp = n => '£' + Number(n).toLocaleString('en-GB');
cfg.fmt = { refresh: gbp(cfg.prices.refresh), rebrand: gbp(cfg.prices.rebrand), care: gbp(cfg.prices.care) };
if (/example\.(com|co)/.test(cfg.email) || /\.example$/.test(cfg.siteUrl)) console.warn('! agency.json still has placeholder email or siteUrl');
module.exports = cfg;
