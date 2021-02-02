import fs from "fs";

export const saveToFile = (
  data: {},
  fileName: string,
  minify: boolean = true
) => {
  const dataString = minify
    ? JSON.stringify(data)
    : JSON.stringify(data, null, 2);

  fs.writeFile(`db/${fileName}`, dataString, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Data saved to ${fileName}`);
  });
};
