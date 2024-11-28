import infos from "~/config/infos"

export function getUsers(email = '') {
    return fetch(`${infos.apiUrl}/users/${email}`)
        .then(data => data.json())
}

export function updateUsers(item, method, email = '') {
    return fetch(`${infos.apiUrl}/users/${email}`, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
    })
    .then(data => data.json())
}