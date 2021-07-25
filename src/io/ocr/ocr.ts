const { createWorker } = require('tesseract.js');
import { OCRTypes } from "../../data/ocrTypes"

export namespace OCR {
    // converts a file hosted in the URL to text. taking in a filename and the language
    export async function convertTextFromURL(url : OCRTypes.Site, lang : OCRTypes.Language) {
        const worker = createWorker({
            logger: (m:any) => console.log(m), // Add logger here
          });
          
          (async () => {
            await worker.load();
            await worker.loadLanguage(lang);
            await worker.initialize(lang);
            const { data: { text } } = await worker.recognize(url);
            console.log(text);
            await worker.terminate();
          })();
    }

    // converts the file to text. taking in a filename and the language
    export async function convertTextFromFile(filename: string, lang: OCRTypes.Language) {
        const worker = createWorker({
            logger: (m:any) => console.log(m), // Add logger here
          });
          
          (async () => {
            await worker.load();
            await worker.loadLanguage(lang);
            await worker.initialize(lang);
            const { data: { text } } = await worker.recognize(filename);
            console.log(text);
            await worker.terminate();
          })();
    }
}