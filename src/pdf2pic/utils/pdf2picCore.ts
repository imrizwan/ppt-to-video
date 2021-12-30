import { defaultOptions } from "../utils/defaultOptions";
import { Options } from "../types/options";
import { Graphics } from "../graphics";
import { convertToStream } from "../utils/converters/convertToStream";
import { Convert } from "../types/convert";
import { bulkConvert } from "../utils/bulk/bulkConvert";
import { WriteImageResponse } from "../types/writeImageResponse";
import { ToBase64Response } from "../types/toBase64Response";

export function pdf2picCore(source: string, filePath: string | Buffer, options = defaultOptions): Convert {
  const gm = new Graphics();

  options = { ...defaultOptions, ...options };

  const convert = (page = 1, toBase64 = false) => {
    if (page < 1) {
      throw new Error("Page number should be more than or equal 1");
    }

    const stream = convertToStream(source, filePath);

    if (!!toBase64) {
      return gm.toBase64(stream, (page - 1));
    }

    return gm.writeImage(stream, (page - 1));
  };

  convert.bulk = (pages: number | number[], toBase64 = false): Promise<WriteImageResponse[] | ToBase64Response[]> => {
    return bulkConvert(gm, source, filePath, pages, toBase64);
  }

  convert.setOptions = (): void => setGMOptions(gm, options);

  convert.setGMClass = (gmClass: string | boolean): void => {
    gm.setGMClass(gmClass);

    return;
  };

  convert.setOptions();

  return convert;
}

function setGMOptions(gm: Graphics, options: Options): void {
  gm.setQuality(options.quality)
  .setFormat(options.format)
  .setSize(options.width, options.height)
  .setDensity(options.density)
  .setSavePath(options.savePath)
  .setSaveFilename(options.saveFilename)
  .setCompression(options.compression)

  return;
}