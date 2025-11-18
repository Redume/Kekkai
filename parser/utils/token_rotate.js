function token_rotate(list, active) {
    if (!Array.isArray(list) || list.length === 0) {
        return;
    }

    if (!Array.isArray(active)) {
        return;
    }

    if (typeof active[0] !== 'number') {
        active[0] = 0;
    }

    active[0] = (active[0] + 1) % list.length;
}

module.exports = token_rotate;