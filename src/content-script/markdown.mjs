import MarkdownIt from 'markdown-it'
import MarkdownItTexmath from 'markdown-it-texmath'
import Katex from 'katex'

/**
 * @returns {MarkdownIt}
 */
export function getMarkdownRenderer() {
  const markdown = new MarkdownIt({
    html: true,
    linkify: true,
  })

  // source: https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer

  // Remember old renderer, if overridden, or proxy to default renderer
  const defaultRender =
    markdown.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }

  markdown.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // If you are sure other plugins can't add `target` - drop check below
    const aIndex = tokens[idx].attrIndex('target')

    if (aIndex < 0) {
      tokens[idx].attrPush(['target', '_blank']) // add new attribute
    } else {
      tokens[idx].attrs[aIndex][1] = '_blank' // replace value of existing attr
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self)
  }

  // use katex for math rendering
  markdown.use(MarkdownItTexmath, {
    engine: Katex,
    delimiters: 'dollars',
    katexOptions: { macros: { '\\RR': '\\mathbb{R}' }, throwOnError: false },
  })

  return markdown
}
