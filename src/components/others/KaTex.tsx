import katex from "katex";
import { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";

function KaTeX({
  texExpression,
}: //   className,
{
  texExpression: string;
  className: string;
}) {
  const containerRef = useRef<HTMLInputElement>(null);
  console.log({ texExpression });

  useEffect(() => {
    katex.render(texExpression, containerRef.current as HTMLInputElement);
  }, [texExpression]);

  return <div ref={containerRef} />;
}

export default KaTeX;
