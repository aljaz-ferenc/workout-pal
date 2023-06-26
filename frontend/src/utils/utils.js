export const formatTime = (time) => {
    let minutes
    let seconds

    if(time < 60){
        minutes = 0
        seconds = time
    }else if (time >= 60){
        minutes = Math.floor(time / 60)
        seconds = time % 60
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}