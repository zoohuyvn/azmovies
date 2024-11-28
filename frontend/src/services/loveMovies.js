import infos from "~/config/infos"

export function postLoveMovies(item) {
    return fetch(`${infos.apiUrl}/love_movies`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
    })
    .then(data => data.json())
}

export function deleteLoveMovies(item, userEmail, slugMovie) {
    return fetch(`${infos.apiUrl}/love_movies/${userEmail}/${slugMovie}`, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
    })
    .then(data => data.json())
}