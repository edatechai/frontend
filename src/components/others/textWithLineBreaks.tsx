import { Fragment } from "react";

function TextWithLineBreaks({ texts }: { texts: string }) {
  console.log({ texts });
  const textWithBreaks = texts?.split("\n")?.map((text, index) => (
    <Fragment key={index}>
      <p dangerouslySetInnerHTML={FormatBold(text)} />
    </Fragment>
  ));

  return <div>{textWithBreaks}</div>;
}

export function TextWithLineBreaksRec({ texts }: { texts: string }) {
  console.log({ texts });
  const textWithBreaks = texts?.split("\\n")?.map((text, index) => (
    <Fragment key={index}>
      {text}
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
