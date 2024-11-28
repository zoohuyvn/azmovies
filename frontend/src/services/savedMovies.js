import infos from "~/config/infos"

export function postSavedMovies(item) {
    return fetch(`${infos.apiUrl}/saved_movies`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
    })
    .then(data => data.json())
}

export function deleteSavedMovies(item, userEmail, slugMovie) {
    return fetch(`${infos.apiUrl}/saved_movies/${userEmail}/${slugMovie}`, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
    })
    .then(data => data.json())
}