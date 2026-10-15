import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDatabase } from '../../db/test-helpers';
import { categories, publishers, games } from '../../db/schema';
import type { Database } from './db';
import { getCatalog } from './games';
import { getAllCategories } from './category-filter';

interface SeededCatalog {
    strategyId: number;
    puzzleId: number;
}

async function insertCategory(db: Database, name: string): Promise<number> {
    const [category] = await db
        .insert(categories)
        .values({ name, description: `${name} games` })
        .returning({ id: categories.id });
    return category.id;
}

async function seedCatalog(db: Database): Promise<SeededCatalog> {
    // Insert names and titles in reverse-alphabetical order to prove ordering is applied.
    const strategyId = await insertCategory(db, 'Strategy');
    const puzzleId = await insertCategory(db, 'Puzzle');
    const [publisher] = await db
        .insert(publishers)
        .values({ name: 'Pub One', description: 'pub' })
        .returning({ id: publishers.id });

    const rows = [
        { title: 'Strategy C', categoryId: strategyId },
        { title: 'Puzzle B', categoryId: puzzleId },
        { title: 'Strategy B', categoryId: strategyId },
        { title: 'Puzzle A', categoryId: puzzleId },
        { title: 'Strategy A', categoryId: strategyId },
    ];
    for (const row of rows) {
        await db.insert(games).values({
            ...row,
            description: `${row.title} description`,
            starRating: 4.2,
            publisherId: publisher.id,
        });
    }

    return { strategyId, puzzleId };
}

const allTitles = ['Puzzle A', 'Puzzle B', 'Strategy A', 'Strategy B', 'Strategy C'];

describe('catalog filtered by category', () => {
    let db: Database;
    let seeded: SeededCatalog;

    beforeEach(async () => {
        db = await createTestDatabase();
        seeded = await seedCatalog(db);
    });

    it('returns the whole catalog ordered by title without parameters', async () => {
        const catalog = await getCatalog(db, new URLSearchParams());
        expect(catalog.games.map((g) => g.title)).toEqual(allTitles);
        expect(catalog.total).toBe(5);
        expect(catalog.filters).toEqual({ categoryIds: [] });
    });

    it('keeps only the games of the chosen category, ordered by title', async () => {
        const catalog = await getCatalog(db, new URLSearchParams({ category: String(seeded.strategyId) }));
        expect(catalog.games.map((g) => g.title)).toEqual(['Strategy A', 'Strategy B', 'Strategy C']);
        expect(catalog.games.every((g) => g.category?.id === seeded.strategyId)).toBe(true);
    });

    it('reports the size of the whole catalog as total when filtering', async () => {
        const catalog = await getCatalog(db, new URLSearchParams({ category: String(seeded.puzzleId) }));
        expect(catalog.games).toHaveLength(2);
        expect(catalog.total).toBe(5);
    });

    it('returns the chosen category in the kept filters', async () => {
        const catalog = await getCatalog(db, new URLSearchParams({ category: String(seeded.puzzleId) }));
        expect(catalog.filters).toEqual({ categoryIds: [seeded.puzzleId] });
    });

    it.each([
        ['an empty value (All categories)', ''],
        ['a non-numeric value', 'abc'],
        ['a value with trailing letters', '12abc'],
        ['a negative number', '-1'],
        ['a decimal number', '1.5'],
        ['a number with spaces', ' 1 '],
        ['a number beyond the safe integer range', '99999999999999999999'],
    ])('ignores %s and returns the whole catalog', async (_label, value) => {
        const catalog = await getCatalog(db, new URLSearchParams({ category: value }));
        expect(catalog.games.map((g) => g.title)).toEqual(allTitles);
        expect(catalog.total).toBe(5);
        expect(catalog.filters).toEqual({ categoryIds: [] });
    });

    it('keeps an unknown category id, which matches no game', async () => {
        const catalog = await getCatalog(db, new URLSearchParams({ category: '99999' }));
        expect(catalog.games).toEqual([]);
        expect(catalog.total).toBe(5);
        expect(catalog.filters).toEqual({ categoryIds: [99999] });
    });

    it('keeps only the first valid category value', async () => {
        const params = new URLSearchParams([
            ['category', ''],
            ['category', 'abc'],
            ['category', String(seeded.puzzleId)],
            ['category', String(seeded.strategyId)],
        ]);
        const catalog = await getCatalog(db, params);
        expect(catalog.games.map((g) => g.title)).toEqual(['Puzzle A', 'Puzzle B']);
        expect(catalog.filters).toEqual({ categoryIds: [seeded.puzzleId] });
    });

    it('ignores parameters of no filter family', async () => {
        const catalog = await getCatalog(db, new URLSearchParams({ sort: 'title', page: '2' }));
        expect(catalog.games.map((g) => g.title)).toEqual(allTitles);
        expect(catalog.filters).toEqual({ categoryIds: [] });
    });
});

describe('getAllCategories', () => {
    let db: Database;

    beforeEach(async () => {
        db = await createTestDatabase();
    });

    it('returns every category ordered by name', async () => {
        const { strategyId, puzzleId } = await seedCatalog(db);
        const actionId = await insertCategory(db, 'Action');
        expect(await getAllCategories(db)).toEqual([
            { id: actionId, name: 'Action' },
            { id: puzzleId, name: 'Puzzle' },
            { id: strategyId, name: 'Strategy' },
        ]);
    });

    it('returns an empty list when there is no category', async () => {
        expect(await getAllCategories(db)).toEqual([]);
    });
});
