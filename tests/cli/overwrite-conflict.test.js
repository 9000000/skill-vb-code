const fs = require('fs-extra');
const path = require('path');
const prompts = require('prompts');
const { confirmOverwrite } = require('../../cli/prompts');

jest.mock('prompts');

describe('Overwrite Conflict & Prompt Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return true when user selects overwrite (true)', async () => {
        prompts.mockResolvedValueOnce({ value: true });

        const result = await confirmOverwrite('GEMINI.md', 'vi');
        expect(result).toBe(true);
        expect(prompts).toHaveBeenCalledTimes(1);
        expect(prompts.mock.calls[0][0].type).toBe('select');
        expect(prompts.mock.calls[0][0].choices).toHaveLength(2);
    });

    it('should return false when user selects do not overwrite (false)', async () => {
        prompts.mockResolvedValueOnce({ value: false });

        const result = await confirmOverwrite('GEMINI.md', 'en');
        expect(result).toBe(false);
        expect(prompts.mock.calls[0][0].type).toBe('select');
    });

    it('should safely return false when prompt is cancelled (undefined)', async () => {
        prompts.mockResolvedValueOnce({});

        const result = await confirmOverwrite('GEMINI.md', 'vi');
        expect(result).toBe(false);
    });
});
