import infos from "~/config/infos"

export function getMovies(slug = '') {
    return fetch(`${infos.apiUrl}/movies/${slug}`)
        .then(data => data.json())
}

export function updateMovies(item, method, slugEdit = '') {
    return fetch(`${infos.apiUrl}/movies/${slugEdit}`, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
    })
    .then(data => data.json())
}