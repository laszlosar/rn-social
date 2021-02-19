const colorPallet = {
    main: '#17b4cb',
    success: '#40f99b',
    error: '#f7567c',
    grey: '#efefef',
    dark: '#086788'
}

function formatDateTime(d){
    date = new Date(d);
    
    let time = date.toLocaleTimeString();
    time = time.split(':'); // convert to array

    // fetch
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    var seconds = Number(time[2]);

    // calculate
    var timeValue;

    if (hours > 0 && hours <= 12) {
    timeValue= "" + hours;
    } else if (hours > 12) {
    timeValue= "" + (hours - 12);
    } else if (hours == 0) {
    timeValue= "12";
    }
    
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
    timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM
    return date.toLocaleDateString() + " " + timeValue;
}

export { colorPallet, formatDateTime }