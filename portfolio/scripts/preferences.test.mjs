import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readLanguage, safeLink } from '../src/lib/preferences.js';
import french from '../src/data/french.js';
import projects from '../src/data/projects.js';

test('language URLs override saved preferences and unknown values fall back safely', () => {
  assert.equal(readLanguage('?lang=fr', 'en'), 'fr');
  assert.equal(readLanguage('?lang=en', 'fr'), 'en');
  assert.equal(readLanguage('', 'fr'), 'fr');
  assert.equal(readLanguage('?lang=de', null), 'en');
});

test('project links reject executable and unsupported protocols', () => {
  for (const value of [undefined, '', 'javascript:alert(1)', 'data:text/html,test', 'http://example.com']) assert.equal(safeLink(value), undefined);
  for (const value of ['/resume.pdf', 'https://github.com/Jameslurtin', 'mailto:hello@example.com', 'tel:+33123456789']) assert.equal(safeLink(value), value);
});

test('French project content includes titles, descriptions and every feature', () => {
  for (const project of projects) {
    for (const text of [project.name, project.short, project.description, ...(project.features || [])]) assert.ok(french[text], `Missing translation: ${text}`);
  }
});
