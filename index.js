function matchLunchEvent(array) {
    drawTime();
    drawLunchTime(array);
}

function drawLunchTime(timings) {
    const timeMap = document.querySelector('#time-map');
    cleanUp(timeMap);
    
    let left = 10;
    //set default as true for nikki
    const [ nikki ] = timings;
    nikki.match = true;
    nikki.name = "ME";
    timings[0] = nikki;
    //end
    timings.sort((a,b) => a.start - b.start);
    const width = 125;
    const { partner , array } = getMatchPerson(timings)
    let [ prev ] = array;

    for( let i = 0; i < array.length ; ++i ) {
        const timing = array[i];
        
        if ( i != 0) {
            if ( timing.start < prev.end ) {
                left = left + width;
            } else {
                prev = timing;
                left = 10;
            }
        }
        const timeDiv = document.createElement('div');
        timeDiv.style.position = "absolute";
        timeDiv.style.top = timing.start + "px";
        timeDiv.style.height = timing.end - timing.start - 1 + "px";
        timeDiv.style.backgroundColor = 'white';
        timeDiv.style.width = width - 5 + "px";
        timeDiv.style.left = left + "px";
        timeDiv.style.borderLeft = timing.match ?( partner ? "5px solid green" : "5px solid black" )  : "5px solid blue";
        timeDiv.innerHTML = timing.name || "Brilliant Lunch";
        timeMap.appendChild(timeDiv);

    }
}

function drawTime() {
    const timings = document.querySelector('#timings');
    const startHour = 9 , endCount = 21;
    let count = 0;
    for( let i = startHour ; i < endCount ; ++i ){
        for( let j = 0 ; j < 2 ; ++j) {
            const hour = i > 12 ? i % 12 : i;
            const minutes = j === 0 ? "00" : "30";
            const timeDiv = document.createElement('div');
            const stamp = i >= 12 ? "PM" : "AM";
            timeDiv.classList.add('time');
            timeDiv.style.top = (count++) * 30 + "px";
            timeDiv.innerHTML = `${hour}:${minutes}${stamp}`;
            timings.appendChild(timeDiv);
        }
    }
}

function cleanUp(ele) {
    const parent = ele;
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}

function getMatchPerson( array ) {
    const [nikki] = array;
    let maxDuration = 0 , index , partner = false;

    for( let i=1;i<array.length;++i ) {

        const person = array[i];
        if( person.name ) {
            continue;
        } 
        if ( person.start === nikki.start && person.end === nikki.end && !person.name ) {
            index = i;
        } else if ( person.start > nikki.start ) {

            const duration = Math.min(nikki.end,person.end) - person.start;
            if ( duration > maxDuration ) {
                maxDuration = duration;
                index = i;
            } else if ( duration === maxDuration ) {
                maxDuration = duration;
                index = array[index].start - person.start >= 0 ? i : index 
            }

        } else if ( person.start <= nikki.start ) {

            const duration = Math.min(nikki.end,person.end) - nikki.start;
            if( duration > maxDuration ) {
                maxDuration = duration;
                index = i;
            } 
        }
    }

    if ( maxDuration >= 30 ) {
        const person = {
            ...array[index],
            match : true
        };
        partner = true;
        array[index] = person;
    }
    return {
        array,
        partner
    };
}