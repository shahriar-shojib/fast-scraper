import { HtmlDocument } from './index.js';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

const main = async htmlStr => {
	console.time('rust');
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
	console.log('rust repos length', repos);
	console.timeEnd('rust');

	console.time('jsdom');
	const jsdom = new JSDOM(htmlStr);
	const { document } = jsdom.window;
	const jsDomRepoNodes = document.querySelectorAll('.pinned-item-list-item-content');

	const jsDomRepos = Array.from(jsDomRepoNodes).map(node => {
		const owner = node.querySelector('span.owner');
		const repo = node.querySelector('span.repo');
		if (owner) {
			return `${owner.innerText}/${repo.innerText}`;
		}
		return repo?.innerText;
	});

	console.log('jsdom repos length', jsDomRepos.length);
	console.timeEnd('jsdom');
};

(async () => {
	const htmlStr = await fetch('https://github.com/shahriar-shojib').then(r => r.text());

	for (let i = 0; i < 5; i++) {
		main(htmlStr);
	}
})();
