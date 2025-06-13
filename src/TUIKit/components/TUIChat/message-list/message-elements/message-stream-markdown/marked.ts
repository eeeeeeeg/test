const marked = require("marked");
const { markedHighlight } = require("marked-highlight");
const hljs = require("highlight.js");
const DOMPurify = require("dompurify");

const escapeTest = /[&<>"']/;
const escapeReplace = new RegExp(escapeTest.source, "g");
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, "g");

type Iescape = {
  [key: string]: string;
};

const escapeReplacements: Iescape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const getEscapeReplacement = (ch: string): string =>
  escapeReplacements[ch as keyof Iescape];

function escape(html: string, encode: boolean = false) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else if (escapeTestNoEncode.test(html)) {
    return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
  }
  return html;
}

// 检查 marked 的 API
console.log("marked object:", marked);
console.log("marked.marked:", marked.marked);
console.log("marked.Marked:", marked.Marked);

// 尝试不同的方式来配置 marked
let markedInstance: any;

if (marked.marked) {
  // 如果存在 marked.marked
  markedInstance = marked.marked;
} else if (typeof marked === "function") {
  // 如果 marked 本身就是函数
  markedInstance = marked;
} else if (marked.Marked) {
  // 如果存在 Marked 构造函数
  markedInstance = new marked.Marked();
} else {
  // 默认情况
  markedInstance = marked;
}

// 尝试配置
try {
  if (markedInstance.setOptions) {
    markedInstance.setOptions({
      mangle: false,
      headerIds: false,
    });
  }

  if (markedInstance.use) {
    markedInstance.use(
      markedHighlight({
        highlight(code: string) {
          return hljs.highlightAuto(code).value;
        },
      })
    );

    markedInstance.use({
      renderer: {
        code(code: string, language: string | undefined, isEscaped: boolean) {
          const lang = language || "";
          return `
            <pre class="hljs message-marked_code-container">
              <div class="message-marked_code-header">
                <span class="message-marked_language-txt">${
                  escape(lang, false) || ""
                }</span>
                <span class="message-marked_copy-btn">copy</span>
              </div>
              <code class="hljs message-marked_code-content language-${escape(
                lang,
                false
              )}">${isEscaped ? code : escape(code, false)}</code>
            </pre>
          `;
        },
        image(href: string | null, title: string | null, text: string) {
          return `<img class="message-marked_image message-image" src="${href}" alt="${text}" title="${title}" />`;
        },
        link(href: string | null, title: string | null, text: string) {
          return `<a target="_blank" rel="noreferrer noopener" class="message-marked_link" href="${href}" title="${title}">${text}</a>`;
        },
      },
    });
  }
} catch (error) {
  console.error("Error configuring marked:", error);
}

export { markedInstance as marked };

export const markedWithPurify = (text: string) => {
  let parsedContent;

  try {
    if (markedInstance.parse) {
      parsedContent = markedInstance.parse(text);
    } else if (typeof markedInstance === "function") {
      parsedContent = markedInstance(text);
    } else {
      throw new Error("Cannot find parse method");
    }

    return DOMPurify.sanitize(parsedContent, { ADD_ATTR: ["target"] });
  } catch (error) {
    console.error("Error parsing markdown:", error);
    return text; // 返回原始文本作为备用
  }
};
