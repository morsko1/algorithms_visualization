const container = document.getElementById('container');

const arr = Array.from(new Array(20), (x, i) => i + 1);

let state = {
    step: 0,
    current: null,
    processed: [],
    start: 0,
    end: arr.length - 1,
    inProcess: true,
    found: null
};

function start (e) {
    e.preventDefault();
    state = {
        step: 0,
        current: null,
        processed: [],
        start: 0,
        end: arr.length - 1,
        inProcess: true,
        found: null
    };
    let item = parseInt(e.target[0].value);
    binarySearchAsync(arr, item);
    return false;
}

function binarySearchAsync (arr, item) {
    function doStep () {
        console.log('doStep ---');
        state.step++;
        let middle = Math.floor((state.start + state.end) / 2);
        state.current = middle;
        console.log('arr = ', arr.slice(state.start, state.end + 1));
        console.log('middle = ', middle);
        if (item === arr[middle]) {
            console.log('found, index is: ', middle);
            console.log('iteration № ', state.step);
            state.inProcess = false;
            state.found = middle;
            render();
            return arr[middle];
        } else if (item < arr[middle]) {
            console.log('less');
            state.processed.push(middle);
            state.end = middle - 1;
        } else if (item > arr[middle]) {
            console.log('bigger');
            state.processed.push(middle);
            state.start = middle + 1;
        }
        if (state.start > state.end) {
            state.inProcess = false;
            console.log('not found');
            console.log('iteration № ', state.step);
            render();
            return undefined;
        }
        render();
    }

    render();
    setTimeout(doStep, state.step === 0 ? 1000 : 0);
    if (!state.inProcess) {
        return;
    }
    setTimeout(function() {
        if (state.inProcess) {
            binarySearchAsync(arr, item);
        }
    }, state.step === 0 ? 2000 : 1000);

}

function render () {
    container.innerHTML = '';
    for (let i = 0; i < arr.length; i++) {
        const elem = document.createElement('div');
        elem.innerHTML = arr[i];
        elem.classList.add('item');
        if (i < state.start || i > state.end) {
            elem.classList.add('disabled');
        }
        if (i === state.current) {
            elem.classList.add('current');
        }
        if (state.processed.includes(i)) {
            elem.classList.add('current');
        }
        
        if (i === state.found) {
            elem.classList.add('found');
        }

        container.appendChild(elem);
    }
}

render();
