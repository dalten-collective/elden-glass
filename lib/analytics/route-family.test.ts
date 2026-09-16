import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { routeFamilyForPath } from './route-family.ts';

test('observed PHP and WordPress probes never become site content', () => {
  for (const path of [
    '/admin.php',
    '/wp-content/themes/index.php',
    '/wp-admin/css/',
    '/.env.local',
    '/.git/config',
    '/OTHER.PHP/path',
  ]) {
    assert.equal(routeFamilyForPath(path), 'probe', path);
  }
});

test('assets and telemetry are separate from site paths at any public location', () => {
  assert.equal(routeFamilyForPath('/duchamp/art.JPG?x=1'), 'static_asset');
  assert.equal(routeFamilyForPath('/_next/data/build.json'), 'static_asset');
  assert.equal(routeFamilyForPath('/_eg/mark/i/v0/e/'), 'telemetry');
  assert.equal(routeFamilyForPath('/_eg/marketing'), 'site_path');
  assert.equal(routeFamilyForPath('/duchamp/art-history'), 'site_path');
  assert.equal(routeFamilyForPath('/invented-article'), 'site_path');
});

test('discovery files and mapped APIs retain their specific meaning', () => {
  assert.equal(routeFamilyForPath('/sitemap.xml'), 'sitemap_catalog');
  assert.equal(routeFamilyForPath('/robots.txt'), 'sitemap_catalog');
  assert.equal(routeFamilyForPath('/feed.xml'), 'feeds');
  assert.equal(routeFamilyForPath('/llms-full.txt'), 'ax_llms_text');
  assert.equal(routeFamilyForPath('/api/llms/article'), 'ax_llms_toc');
  assert.equal(routeFamilyForPath('/api/item-cards/card.png'), 'item_cards');
  assert.equal(routeFamilyForPath('/api/not-a-route'), 'unknown');
  assert.equal(routeFamilyForPath('/cb05d35765734697acbac8a8a77f4b68.txt'), 'static_asset');
  assert.equal(routeFamilyForPath('/.well-known/llms.txt'), 'ax_llms_text');
  assert.equal(routeFamilyForPath('/.well-known/llms-full.txt'), 'ax_llms_text');
});

test('nested configuration probes are distinct from similarly named articles', () => {
  for (const path of [
    '/html/.git/config',
    '/frontend/.env',
    '/.ssh/id_ecdsa',
    '/.claude/settings.json',
    '/.aws/credentials',
    '/credentials.json',
  ]) {
    assert.equal(routeFamilyForPath(path), 'probe', path);
  }
  for (const path of [
    '/duchamp/credentials',
    '/author/claude',
    '/environment',
    '/.well-known/jwks.json',
  ]) {
    assert.equal(routeFamilyForPath(path), 'site_path', path);
  }
});
