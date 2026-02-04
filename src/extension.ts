import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

//
// Helper: nested key'i objeden al
//
function getValue(obj: any, key: string) {
	return key.split('.').reduce((acc, k) => acc?.[k], obj);
}

//
// Helper: workspace içindeki locales dosyalarını otomatik bul
//
function findLocaleFiles(): string[] {
	const workspace = vscode.workspace.workspaceFolders?.[0];
	if (!workspace) return [];

	const root = workspace.uri.fsPath;

	// Tüm workspace içindeki ts dosyalarını tara
	const result: string[] = [];
	function walk(dir: string) {
		const files = fs.readdirSync(dir);
		for (const file of files) {
			const full = path.join(dir, file);
			const stat = fs.statSync(full);

			if (stat.isDirectory()) {
				walk(full);
			} else if (stat.isFile() && file.match(/^[a-z]{2}\.ts$/i)) {
				// tr.ts, en.ts gibi dosyalar
				result.push(full);
			}
		}
	}

	walk(root);
	return result;
}

//
// Hover markdown hazırla
//
async function getHoverMarkdown(key: string) {
	const md = new vscode.MarkdownString();
	md.appendMarkdown(`**${key}**\n\n`);

	// sadece bulunan locale dosyaları
	const files = findLocaleFiles();
	if (files.length === 0) return; // hiç dosya yoksa sessiz

	for (const filePath of files) {
		const lang = path.basename(filePath, '.ts');

		try {
			const localeModule = await import(filePath);
			const data = localeModule.default.translation ?? localeModule.default;
			const value = getValue(data, key);

			if (value !== undefined) {
				md.appendMarkdown(`**${lang}**: ${value}\n\n`);
			}
			// value undefined ise sessiz bırak
		} catch (e) {
			// dosya açılmazsa sessiz bırak
		}
	}

	md.isTrusted = true;
	return md;
}

//
// Hover provider register
//
function registerHover(context: vscode.ExtensionContext) {
	const provider = vscode.languages.registerHoverProvider(['javascript', 'typescript', 'typescriptreact'], {
		async provideHover(document, position) {
			const range = document.getWordRangeAtPosition(
				position,
				/t\(\s*['"`]([^'"`]+)['"`]/, // ilk string parametreyi yakala
			);

			if (!range) return;

			const text = document.getText(range);
			const match = text.match(/t\(\s*['"`]([^'"`]+)['"`]/);
			if (!match) return;

			const key = match[1]; // sadece key alıyoruz

			const md = await getHoverMarkdown(key);
			return new vscode.Hover(md ?? '');
		},
	});

	context.subscriptions.push(provider);
}

//
// activate
//
export function activate(context: vscode.ExtensionContext) {
	console.log('i18n Hover activated');

	// Hover
	registerHover(context);
}

//
// deactivate
//
export function deactivate() {}
