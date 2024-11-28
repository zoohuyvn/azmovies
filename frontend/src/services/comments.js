import infos from "~/config/infos"

export function postComments(item) {
    return fetch(`${infos.apiUrl}/comments`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
    })
    .then(data => data.json())
}

export function deleteComments(item, userEmail, slugMovie, commentContent) {
    return fetch(`${infos.apiUrl}/comments/${userEmail}/${slugMovie}/${commentContent}`, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
    })
    .then(data => data.json())
}