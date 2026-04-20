import prettier from 'prettier/standalone';
import parserHtml from 'prettier/plugins/html';
import parserCss from 'prettier/plugins/postcss';
import parserBabel from 'prettier/plugins/babel';
import parserEstree from 'prettier/plugins/estree';

const base = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  bracketSameLine: true,
};

export async function formatCode(
  lang: 'html' | 'css' | 'js',
  source: string,
): Promise<string> {
  try {
    if (lang === 'html') {
      return await prettier.format(source, {
        ...base,
        parser: 'html',
        plugins: [parserHtml],
        htmlWhitespaceSensitivity: 'ignore',
      });
    }
    if (lang === 'css') {
      return await prettier.format(source, {
        ...base,
        parser: 'css',
        plugins: [parserCss],
      });
    }
    return await prettier.format(source, {
      ...base,
      parser: 'babel',
      plugins: [parserBabel, parserEstree],
    });
  } catch {
    // If the code is mid-edit and can't parse, leave it untouched.
    return source;
  }
}
