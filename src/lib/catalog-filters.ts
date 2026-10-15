import { readCategoryIds } from './category-filter';

/** The filters kept from the URL, once invalid values are dropped. */
export interface CatalogFilters {
    categoryIds: number[];
}

/** Build the catalog filters from the URL parameters, delegating to each filter family. */
export function readCatalogFilters(searchParams: URLSearchParams): CatalogFilters {
    return {
        categoryIds: readCategoryIds(searchParams),
    };
}

/** Whether at least one filter restricts the catalog. */
export function hasActiveFilters(filters: CatalogFilters): boolean {
    return Object.values(filters).some((value: unknown) =>
        Array.isArray(value) ? value.length > 0 : value !== null,
    );
}
