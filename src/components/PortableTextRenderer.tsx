import { PortableText, type PortableTextReactComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "../lib/sanity";
import ReactPlayer from "react-player";

interface PortableTextRendererProps {
  value: PortableTextBlock[];
}

// Custom components for rendering Portable Text
const components: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) {
        return null;
      }
      return (
        <figure className="sanity-image">
          <img
            src={urlFor(value).width(1200).auto("format").url()}
            alt={value.alt || "Blog image"}
            loading="lazy"
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },
    code: ({ value }) => {
      return (
        <div className="code-block">
          {value.filename && <div className="code-filename">{value.filename}</div>}
          <pre data-language={value.language}>
            <code>{value.code}</code>
          </pre>
        </div>
      );
    },
    youtube: ({ value }) => {
      const { url } = value;
      return <ReactPlayer url={url} />;
    },
  },
  marks: {
    link: ({ children, value }) => {
      // Extract href - it might be in value.href or directly in value
      const href = value?.href || value?.url || "";
      // Check if blank is explicitly set, default to true for external links
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
      const shouldOpenInNewTab = value?.blank !== false; // Default to true unless explicitly false
      const target = shouldOpenInNewTab ? "_blank" : undefined;

      console.log("Link render:", { href, value, shouldOpenInNewTab }); // Debug log

      return (
        <a
          href={href}
          target={target}
          rel={target ? "noopener noreferrer" : undefined}
          className="portable-text-link"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => {
      return <code className="inline-code">{children}</code>;
    },
  },
  block: {
    h1: ({ children }) => <h1 className="sanity-h1">{children}</h1>,
    h2: ({ children }) => <h2 className="sanity-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="sanity-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="sanity-h4">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="sanity-blockquote">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="sanity-paragraph">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="sanity-list-bullet">{children}</ul>,
    number: ({ children }) => <ol className="sanity-list-number">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="sanity-list-item">{children}</li>,
    number: ({ children }) => <li className="sanity-list-item">{children}</li>,
  },
};

export default function PortableTextRenderer({ value }: PortableTextRendererProps) {
  if (!value) {
    return null;
  }

  return (
    <div className="portable-text-content">
      <PortableText value={value} components={components} />
    </div>
  );
}
