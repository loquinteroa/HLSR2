declare module 'export-to-csv' {
  export interface Options {
    filename?: string;
    fieldSeparator?: string;
    quoteStrings?: string;
    decimalSeparator?: string;
    showLabels?: boolean;
    showTitle?: boolean;
    title?: string;
    useTextFile?: boolean;
    useBom?: boolean;
    useKeysAsHeaders?: boolean;
    headers?: string[];
  }

  export default class ExportToCsv {
    constructor(options: Options);
    generateCsv(data: any[]): void;
  }
}
