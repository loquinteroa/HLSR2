import ExportToCsv from 'export-to-csv';
import { Link } from '../../types/link';
import { dateFormat } from './common';

//https://www.npmjs.com/package/export-to-csv

const options = {
    filename: 'Link66-LinkReport',
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: false,
    title: 'Link66 Links',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ['ID', 'Short Url', 'Full Url', 'Owner(s)', 'Hits', 'Last Acccessed', 'QR Code', 'Last Updated']
};

const cleanData = (links: Link[]) => {
    return links.map(({ id, shortUrl, fullUrl, owners, hits, lastAccessedAt, qrCodeUrl, updatedAt }) => ({
        id,
        shortUrl,
        fullUrl,
        owners: owners?.map((owner) => owner.name).join("; "),
        hits: hits?.toLocaleString(),
        lastAccessedAt: dateFormat(lastAccessedAt),
        qrCodeUrl,
        updatedAt: dateFormat(updatedAt)
    }));
};

export const ExportLinksToCsv = (links: Link[]) => {
    const cleanedLinks = cleanData(links);
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(cleanedLinks);
}

