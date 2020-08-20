var scrape = require('./app');
const { config } = require('npm');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

describe ('puppeeteer login github', () => {
    test('should return Array', async () => {
        let users = await scrape ({
            username: config.github.username,
            password: config.github.password,
            search: 'bitcoin',
            maxPage: 20,
        });

        const resp = {
            username: expect.stringMatching(/.*/),
            password: expect.stringMatching(/@/),
        };

        expect(Array.isArray(users)).toBe(true)
        expect(users.length).toBeGreaterThan(0);
    })
})