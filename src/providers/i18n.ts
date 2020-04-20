import i18n from "@indicado/i18n";
import path from "path";

i18n.configure({
  multiDirectories: true,
  defaultLocale: "en",
  queryParameter: "lang",
});

i18n.configure({
  directory: path.join("./", "src/locales/music"),
  dirName: "music",
});

i18n.configure({
  directory: path.join("./", "src/locales/util"),
  dirName: "util",
});

export default i18n;
