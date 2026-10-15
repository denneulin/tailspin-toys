/** Parse a URL parameter value as an entity id, or null when it is not a plain positive integer. */
export function parseFilterId(value: string): number | null {
    if (!/^\d+$/.test(value)) {
        return null;
    }
    const id = Number(value);
    return Number.isSafeInteger(id) ? id : null;
}
