import { Fragment } from "react";

function TextWithLineBreaks({ texts }: { texts: string }) {
  const textWithBreaks = texts?.split("\n")?.map((text, index) => (
    <Fragment key={index}>
      {text}
      <br />
    </Fragment>
  ));

  return <div>{textWithBreaks}</div>;
}

export default TextWithLineBreaks;
