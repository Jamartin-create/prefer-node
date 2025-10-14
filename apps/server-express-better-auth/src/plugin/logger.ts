import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const customFormat = format.combine(
    format.timestamp({ format: 'YYYY-MMM-DD HH:mm:ss' }),
    format.printf(i => `${i.level}——${[i.timestamp]}: ${i.message}`)
);

const defaultOptions = {
    format: customFormat,
    datePattery: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '14d',
    maxsize: '20m'
};

const withConsole = new transports.Console({
    format: customFormat
});

export const globLogger = createLogger({
    format: customFormat,
    transports: [
        new transports.DailyRotateFile({
            filename: 'logs/%DATE%/info.log',
            level: 'info',
            ...defaultOptions
        }),
        new transports.DailyRotateFile({
            filename: 'logs/%DATE%/error.log',
            level: 'error',
            ...defaultOptions
        })
    ]
}).add(withConsole);

export const authLogger = createLogger({
    transports: [
        new transports.DailyRotateFile({
            filename: 'logs/%DATE%/authLog.log',
            ...defaultOptions
        })
    ]
}).add(withConsole);
