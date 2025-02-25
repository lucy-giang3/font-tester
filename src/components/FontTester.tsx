import { useState } from "react";

export default function FontTester() {
  const [fonts, setFonts] = useState<
    {
      id: number;
      file: File;
      url: string;
      fontColor: string;
      bgColor: string;
      fontSize: number;
    }[]
  >([]);
  const [text, setText] = useState("Your text here");
  const [copiedStyle, setCopiedStyle] = useState<{
    fontColor: string;
    bgColor: string;
    fontSize: number;
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const id = Date.now();
      setFonts((prevFonts) => [
        ...prevFonts,
        {
          id,
          file,
          url,
          fontColor: "#000000",
          bgColor: "#ffffff",
          fontSize: 16,
        },
      ]);

      const newFontFace = new FontFace(`customFont-${id}`, `url(${url})`);
      newFontFace.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
      });
    }
  };

  const removeFont = (id: number) => {
    setFonts((prevFonts) => prevFonts.filter((font) => font.id !== id));
  };

  const copyStyle = (font: {
    fontColor: string;
    bgColor: string;
    fontSize: number;
  }) => {
    setCopiedStyle({
      fontColor: font.fontColor,
      bgColor: font.bgColor,
      fontSize: font.fontSize,
    });
  };

  const pasteStyle = (id: number) => {
    if (copiedStyle) {
      setFonts((prevFonts) =>
        prevFonts.map((font) =>
          font.id === id ? { ...font, ...copiedStyle } : font
        )
      );
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <label className="mb-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
        Upload File
        <input
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 mb-4"
      />
      {fonts.map((font) => (
        <div
          key={font.id}
          className="mt-4 p-4 border rounded shadow flex flex-col items-center w-full max-w-lg"
        >
          <div className="w-full flex items-center justify-between">
            <div
              className="flex-1 p-4"
              style={{
                color: font.fontColor,
                backgroundColor: font.bgColor,
                fontFamily: `customFont-${font.id}`,
                fontSize: `${font.fontSize}px`,
              }}
            >
              {text}
            </div>
            <div className="flex flex-col items-center ml-4">
              <input
                type="color"
                value={font.fontColor}
                onChange={(e) =>
                  setFonts((prevFonts) =>
                    prevFonts.map((f) =>
                      f.id === font.id ? { ...f, fontColor: e.target.value } : f
                    )
                  )
                }
              />
              <input
                type="color"
                value={font.bgColor}
                onChange={(e) =>
                  setFonts((prevFonts) =>
                    prevFonts.map((f) =>
                      f.id === font.id ? { ...f, bgColor: e.target.value } : f
                    )
                  )
                }
              />
              <input
                type="number"
                value={font.fontSize}
                min="8"
                max="100"
                onChange={(e) =>
                  setFonts((prevFonts) =>
                    prevFonts.map((f) =>
                      f.id === font.id
                        ? { ...f, fontSize: parseInt(e.target.value) }
                        : f
                    )
                  )
                }
                className="mt-2 border p-1 w-16"
              />
            </div>
            <div className="flex flex-col ml-4">
              <button
                className="px-3 py-1 bg-green-500 text-white rounded mb-2"
                onClick={() => copyStyle(font)}
              >
                Copy
              </button>
              <button
                className="px-3 py-1 bg-yellow-500 text-white rounded mb-2"
                onClick={() => pasteStyle(font.id)}
              >
                Paste
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => removeFont(font.id)}
              >
                X
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">{font.file.name}</p>
        </div>
      ))}
    </div>
  );
}
