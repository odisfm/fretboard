type LexorankHaver = {
    order?: string
}

export function sortByLexorank(a: LexorankHaver, b: LexorankHaver): number {
    const aRank = a?.order
    const bRank = b?.order
    if (!aRank && !bRank) {
        return 0
    }
    if (!aRank) {
        return 1
    }
    if (!bRank) {
        return -1
    }
    if (aRank < bRank) {
        return -1
    } else if (aRank > bRank) {
        return 1
    } else {
        // should never happen...
        return 0
    }
}
