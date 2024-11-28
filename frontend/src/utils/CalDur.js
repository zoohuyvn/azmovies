export default function CalDur(dur) {
    let rs = ''
    let hours = Math.floor(dur / 3600)
    let minutes = Math.floor(dur / 60) - hours * 60
    rs = hours + 'h ' + minutes + 'm'
    return rs
}