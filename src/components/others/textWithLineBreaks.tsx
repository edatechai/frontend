import { Fragment } from "react";
import { formatQuizHtml } from "@/lib/utils";

function TextWithLineBreaks({ texts }: { texts: string }) {
  console.log({ texts });
  const textWithBreaks = texts?.split("\n")?.map((text, index) => (
    <Fragment key={index}>
      <p dangerouslySetInnerHTML={FormatBold(formatQuizHtml(text))} />
    </Fragment>
  ));

  return <div>{textWithBreaks}</div>;
}

export function TextWithLineBreaksRec({ texts }: { texts: string }) {
  console.log({ texts });
  const textWithBreaks = texts?.split("\\n")?.map((text, index) => (
    <Fragment key={index}>
      <span dangerouslySetInnerHTML={{ __html: formatQuizHtml(text) }} />
      <br />
    </Fragment>
  ));

  return <div>{textWithBreaks}</div>;
}

export const FormatBold = (text) => {
  // Replace **word** with <strong>word</strong>
  const formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  return { __html: formattedText };
};

export default TextWithLineBreaks;
