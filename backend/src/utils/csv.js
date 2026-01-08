import { Parser } from 'json2csv';

export const toCSV = (data) => {
    if (!data || data.length === 0) {
        return '';
    }

    const parser = new Parser({
        withBOM: true // helps Excel
    });

    return parser.parse(data);
};
