import test from 'ava';

import fetch from 'node-fetch';

import { HtmlDocument } from '../index.js';

test('sum from native', async t => {
	const htmlStr = await fetch('https://github.com/shahriar-shojib').then(r => r.text());

	const html = new HtmlDocument(htmlStr);

	const repoNodes = html.select('.pinned-item-list-item-content');

	const repos = repoNodes.map(node => {
		const [owner] = node.select('span.owner');
		const [repo] = node.select('span.repo');
		if (owner) {
			return `${owner.innerText()}/${repo.innerText()}`;
		}
		return repo?.innerText();
	});

	console.log(repos);

	t.assert(repos.length > 0);
});
