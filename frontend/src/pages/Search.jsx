import DocViewer, { PDFRenderer, PNGRenderer, HTMLRenderer } from "react-doc-viewer";

function Search() {
  const docs = [
      { uri: "https://drive.google.com/file/d/1vzcr6-LXHFkyHziSUAwVD5SGdZ9Mn5HT/view?usp=sharing" },
    //   { uri: require("../Assets/pdf_examples/Models Django.pdf") },
    ];

  return <DocViewer 
  className="DocViewer"
    documents={docs}
    theme={{
        primary: "#5296d8",
        secondary: "#ffffff",
        tertiary: "#5296d899",
        text_primary: "#ffffff",
        text_secondary: "#5296d8",
        text_tertiary: "#00000099",
        disableThemeScrollbar: false,
      }}
  pluginRenderers={[PDFRenderer, PNGRenderer, HTMLRenderer]}/>;
}

export default Search;