// Toast('error', 'Browser Update available', 'For the best experience, please update your browser.')

// Dialog('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa mục này không?')
// .then(confirmed => {
//     if (confirmed) {
//         console.log('Đã xóa mục.')
//     } else {
//         console.log('Đã hủy xóa.')
//     }
// })

import { createRoot } from 'react-dom/client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCircleCheck,
    faCircleExclamation,
    faCircleInfo,
    faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons"

const icons = {
    'info': <FontAwesomeIcon icon={faCircleInfo}/>,
    'warning': <FontAwesomeIcon icon={faCircleExclamation}/>,
    'error': <FontAwesomeIcon icon={faTriangleExclamation}/>,
    'success': <FontAwesomeIcon icon={faCircleCheck}/>
}

function Toast(typeIcon, title, description, timeout = 2000) {
    const toastElement = document.createElement('div')
    toastElement.classList.add('toast', typeIcon)
    const toastHeader = document.createElement('div')
    toastHeader.classList.add('toast-header')
    const iconWrap = document.createElement('div')
    const root = createRoot(iconWrap)
    root.render(icons[typeIcon])
    const titleElement = document.createElement('h3')
    titleElement.textContent = title
    toastHeader.appendChild(iconWrap)
    toastHeader.appendChild(titleElement)
    toastElement.appendChild(toastHeader)

    if (description) {
        const descriptionElement = document.createElement('p')
        descriptionElement.textContent = description
        toastElement.appendChild(descriptionElement)
    }
    document.body.appendChild(toastElement)

    setTimeout(() => toastElement.remove(), timeout + 250)
}

function Dialog(title, description) {
    const dialogOverlay = document.createElement('div')
    dialogOverlay.classList.add('dialog-overlay')
    const dialogElement = document.createElement('div')
    dialogElement.classList.add('dialog')
    const titleElement = document.createElement('h2')
    titleElement.textContent = title
    dialogElement.appendChild(titleElement)

    if (description) {
        const descriptionElement = document.createElement('p')
        descriptionElement.textContent = description
        dialogElement.appendChild(descriptionElement)
    }

    const cancelButton = document.createElement('button')
    cancelButton.textContent = 'Cancel'
    cancelButton.classList.add('btn', 'cancel')
    dialogElement.appendChild(cancelButton)

    const confirmButton = document.createElement('button')
    confirmButton.textContent = 'Confirm'
    confirmButton.classList.add('btn', 'active')
    dialogElement.appendChild(confirmButton)

    dialogOverlay.appendChild(dialogElement)
    document.body.appendChild(dialogOverlay)

    return new Promise(resolve => {
        confirmButton.addEventListener('click', () => {
            dialogOverlay.remove()
            resolve(true)
        })

        cancelButton.addEventListener('click', () => {
            dialogOverlay.remove()
            resolve(false)
        })
    })
}

export { Toast, Dialog }