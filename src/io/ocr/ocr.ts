import Tesseract from "tesseract.js";
import { OCRTypes } from "../../data/ocrTypes"

export namespace OCR {
    export function convertTextFromImage(url : OCRTypes.Site, lang : OCRTypes.Language) {
        Tesseract.recognize(
            url,
            lang,
            { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
            console.log(text);
        })
    }
}