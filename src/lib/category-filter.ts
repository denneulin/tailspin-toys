import { asc, inArray, type SQL } from 'drizzle-orm';
import type { Database } from './db';
import { categories, games } from '../../db/schema';
import type { Category } from '../types/game';
import { parseFilterId } from './filter-ids';

/** The category ids kept from the `category` URL parameter: only the first valid value. */
export function readCategoryIds(searchParams: URLSearchParams): number[] {
    for (const value of searchParams.getAll('category')) {
        const id = parseFilterId(value);
        if (id !== null) {
            return [id];
        }
    }
    return [];
}

/** Games whose category is one of the given ids; no restriction when the list is empty. */
export function categoryCondition(categoryIds: number[]): SQL | undefined {
    return categoryIds.length > 0 ? inArray(games.categoryId, categoryIds) : undefined;
}

/** All categories ordered by name. */
export async function getAllCategories(db: Database): Promise<Category[]> {
    return db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .orderBy(asc(categories.name));
}
