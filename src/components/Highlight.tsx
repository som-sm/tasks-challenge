export function Highlight({ term, children }: { term: string; children: string }) {
  if (!term) {
    return children;
  }

  return children.split(new RegExp(`(${term})`, "gi")).map((part, index) => {
    if (part.toLowerCase() === term.toLowerCase()) {
      return (
        <mark key={index} className="bg-lime-200">
          {part}
        </mark>
      );
    }

    return part;
  });
}
