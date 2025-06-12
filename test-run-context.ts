export const RUN_TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
export const RUN_NAME = process.env.RUN_NAME || 'run';
export const BASE_DIR = `test-results/${RUN_NAME}--${RUN_TIMESTAMP}`;